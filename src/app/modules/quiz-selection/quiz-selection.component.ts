import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from 'src/app/models/question.model';
import { QuizService } from 'src/app/modules/core/services/quiz/quiz.service';
import { QuizSelectionError } from './enums/quiz-selection.error.enum';

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.scss']
})
export class QuizSelectionComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  readonly MAX_QUESTIONS: number = 100;

  readonly TRUNCATE_LIMIT: number = 35;

  readonly MIN_MINUTES: number = 5;

  readonly MAX_MINUTES: number = 120;
  
  questions: Question[] = [];

  quizzes: Map<string, Question[]> = new Map<string, Question[]>();

  errorMessage: string = '';

  minutes: number = 30;

  constructor(private quizService: QuizService, private router: Router) { }

  ngOnInit(): void {
    this.quizService.setQuestions([]); // Clear any existing quiz data on component initialization
  }
  
  onFileSelected(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    // Validate file selection
    if (!input.files || !input.files?.length) {
      this.errorMessage = '';
      return;
    }

    const files: File[] = Array.from(input.files);
    for (const file of files) {
      this.errorMessage = this.validateFile(file);
      if (this.errorMessage) return;
    }

    for (const file of files) {
      const reader: FileReader = new FileReader();
      reader.readAsText(file); // Read the selected file as text so that it may be parsed as JSON
      reader.onload = () => {
        try {
          this.parseQuizFile(reader.result as string, file.name);
        } catch (e) {
          console.error('Error parsing JSON:', e);
          this.errorMessage = QuizSelectionError.JSON_PARSE_ERROR;
        }
      };
    }
  }

  validateFile(file: File): string {
    let errorMessage = '';
    if (file.type !== 'application/json' || !file.name.endsWith('.json')) {
      errorMessage = QuizSelectionError.INVALID_FILE_TYPE;
    } else if (this.quizzes.has(file.name)) {
      errorMessage = QuizSelectionError.FILE_ALREADY_UPLOADED;
    }
    return errorMessage;
  }

  parseQuizFile(content: string, fileName: string): void {
    const quiz = JSON.parse(content);
    this.errorMessage = this.validateQuiz(quiz);
    if (this.errorMessage) return;

    const questions: Question[] = quiz.questions.map((q: any) => new Question(q));
    this.questions.push(...questions);
    this.quizzes.set(fileName, questions);

    if (this.questions.length >= this.MAX_QUESTIONS) {
      this.errorMessage = QuizSelectionError.MAX_QUESTIONS_REACHED;
    }
  }

  validateQuiz(quiz: any): string {
    let errorMessage = '';
    switch (true) {
      case (!quiz.questions || !Array.isArray(quiz.questions)):
        errorMessage = QuizSelectionError.INVALID_QUIZ_FORMAT_MISSING_QUESTIONS;
        break;
      case (quiz.questions.length === 0):
        errorMessage = QuizSelectionError.QUIZ_CONTAINS_NO_QUESTIONS;
        break;
      case (!quiz.questions.every((q: any) => q.prompt && q.options && q.answer)):
        errorMessage = QuizSelectionError.INVALID_QUIZ_FORMAT_MISSING_PROPERTIES;
        break;
      case (!quiz.questions.every((q: any) => Array.isArray(q.options) && q.options.length >= 2)):
        errorMessage = QuizSelectionError.INVALID_QUIZ_FORMAT_INSUFFICIENT_OPTIONS;
        break;
      case (!quiz.questions.every((q: any) => q.options.includes(q.answer))):
        errorMessage = QuizSelectionError.INVALID_QUIZ_FORMAT_ANSWER_NOT_IN_OPTIONS;
        break;
      case (this.questions.length + quiz.questions.length > this.MAX_QUESTIONS):
        errorMessage = `${QuizSelectionError.EXCEEDS_QUESTION_LIMIT}${this.MAX_QUESTIONS}.`;
        break;
    }
    return errorMessage;
  }

  clearFiles(): void {
    if (this.quizzes.size === 0) return;

    this.quizzes.clear();
    this.questions = [];
    this.errorMessage = '';
    this.fileInput.nativeElement.value = '';
  }

  startQuiz(): void {
    if (this.questions.length === 0 || this.minutes < this.MIN_MINUTES || this.minutes > this.MAX_MINUTES) return;

    this.quizService.setQuestions(this.questions);
    this.quizService.setMinutes(this.minutes);
    this.router.navigate(['/quiz']);
  }

  removeFile(fileName: string): void {
    const questionsToRemove = this.quizzes.get(fileName);
    if (!questionsToRemove) return;

    this.questions = this.questions.filter(q => !questionsToRemove.includes(q));
    this.quizzes.delete(fileName);
    this.errorMessage = '';
    this.fileInput.nativeElement.value = '';
  }
}
