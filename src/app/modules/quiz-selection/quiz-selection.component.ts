import { Component } from '@angular/core';
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
  readonly MAX_QUESTIONS: number = 100;
  
  questions: Question[] = [];

  files: String[] = [];

  errorMessage: string = '';

  constructor(private quizService: QuizService, private router: Router) {
    this.quizService.setQuestions([]); // Clear any existing quiz data on component initialization
    this.quizService.setIsQuizActive(false);
  }
  
  onFileSelected(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    // Validate file selection
    if (!input.files || !input.files?.length) {
      this.errorMessage = QuizSelectionError.NO_FILE_SELECTED;
      return;
    } else if (input.files.length > 1) {
      this.errorMessage = QuizSelectionError.MULTIPLE_FILES_SELECTED;
      return;
    }

    const file: File = input.files[0];
    this.errorMessage = this.validateFile(file);
    if (this.errorMessage) return;

    const reader = new FileReader();
    reader.readAsText(file); // Read the selected file as text so that we can parse it as JSON later
    reader.onload = () => {
      try {
        const data: any = JSON.parse(reader.result as string);
        this.errorMessage = this.validateQuiz(data);
        if (this.errorMessage) return;

        const questions = data.questions.map((q: any) => new Question(q));
        this.questions.push(...questions);
        this.files.push(file.name);
        if (this.questions.length >= this.MAX_QUESTIONS) {
          this.errorMessage = QuizSelectionError.MAX_QUESTIONS_REACHED;
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
        this.errorMessage = QuizSelectionError.JSON_PARSE_ERROR;
      }
    };
  }

  validateFile(file: File): string {
    let errorMessage = '';
    if (file.type !== 'application/json') {
      errorMessage = QuizSelectionError.INVALID_FILE_TYPE;
    } else if (this.files.includes(file.name)) {
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
    if (this.files.length === 0) return;

    this.files = [];
    this.questions = [];
    this.errorMessage = '';
  }

  startQuiz(): void {
    if (this.questions.length === 0) return;

    this.quizService.setQuestions(this.questions);
    this.quizService.setIsQuizActive(true);
    this.router.navigate(['/quiz']);
  }
}
