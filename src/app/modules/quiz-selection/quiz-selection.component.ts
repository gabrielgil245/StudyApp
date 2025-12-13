import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from 'src/app/models/question.model';
import { QuizService } from 'src/app/modules/core/services/quiz/quiz.service';
import { QuizSelectionError } from './enums/quiz-selection.error.enum';

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.scss']
})
export class QuizSelectionComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  readonly MAX_QUESTIONS: number = 100;

  readonly TRUNCATE_LIMIT: number = 35;
  
  questions: Question[] = [];

  quizzes: Map<string, Question[]> = new Map<string, Question[]>();

  errorMessage: string = '';

  constructor(private quizService: QuizService, private router: Router) {
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
      const reader = new FileReader();
      reader.readAsText(file); // Read the selected file as text so that it may be parsed as JSON
      reader.onload = () => {
        try {
          const quiz: any = JSON.parse(reader.result as string);
          this.errorMessage = this.validateQuiz(quiz);
          if (this.errorMessage) return;

          const questions = quiz.questions.map((q: any) => new Question(q));
          this.questions.push(...questions);
          this.quizzes.set(file.name, questions);
          if (this.questions.length >= this.MAX_QUESTIONS) {
            this.errorMessage = QuizSelectionError.MAX_QUESTIONS_REACHED;
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
          this.errorMessage = QuizSelectionError.JSON_PARSE_ERROR;
        }
      };
    }
  }

  validateFile(file: File): string {
    let errorMessage = '';
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      errorMessage = QuizSelectionError.INVALID_FILE_TYPE;
    } else if (this.quizzes.has(file.name)) {
      errorMessage = QuizSelectionError.FILE_ALREADY_UPLOADED;
    }
    return errorMessage;
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
    if (this.questions.length === 0) return;

    this.quizService.setQuestions(this.questions);
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
