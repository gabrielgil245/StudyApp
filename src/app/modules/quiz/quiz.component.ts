import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Question } from 'src/app/models/question.model';
import { QuizService } from 'src/app/modules/core/services/quiz/quiz.service';
import { Modal } from 'bootstrap';
import { ModalPayload } from 'src/app/models/modal-payload.model';
import { PromptPayload } from 'src/app/models/prompt-payload.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly INCOMPLETE_RESPONSES_WARNING: string = 'You have unanswered questions. Are you sure you want to end the quiz?';

  readonly ALL_RESPONSES_COMPLETED_WARNING: string = 'You have answered all questions. Do you want to submit and view results?';
  
  questions: Question[] = [];

  isLoading: boolean = true;

  question: Question | null = null;

  index: number = -1; // Start before the first question

  endQuizSessionSubscription$: Subscription | undefined;

  isUserNotifiedOfQuizCompletion: boolean = false;

  modalPayload: ModalPayload | null = null;

  modalInstance!: Modal;

  constructor(private quizService: QuizService, private router: Router) {
    this.questions = this.quizService.getQuestions();
    this.quizService.setIsQuizActive(true);
  }

  ngOnInit(): void {
    if (!this.questions.length) {
      this.router.navigate(['/quiz-selection']);
      return;
    }

    this.initializeEndQuizSessionSubscription();
    this.randomizeQuestions();
    this.nextQuestion();
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('staticBackdrop');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  ngOnDestroy(): void {
    this.endQuizSessionSubscription$?.unsubscribe();
  }

  randomizeQuestions(): void {
    this.questions.sort(() => Math.random() - 0.5);
  }

  nextQuestion(): void {
    this.isLoading = true;
    // Using setTimeout to simulate async loading behavior
    setTimeout(() => {
      // Is user notified must be positioned before verifyResponsesComplete to avoid unsatisfied state
      if (!this.isUserNotifiedOfQuizCompletion && this.verifyResponsesComplete()) {
        this.openEndQuizModal(this.ALL_RESPONSES_COMPLETED_WARNING);
        this.isLoading = false;
        return;
      }
      if (this.index >= this.questions.length - 1) this.index = -1;
      this.setQuestion(++this.index);
      this.isLoading = false;
    }, 300);
  }

  initializeEndQuizSessionSubscription(): void {
    this.endQuizSessionSubscription$ = this.quizService.getEndQuizSessionObservable().subscribe((endQuizSession: boolean) => {
      if (!endQuizSession) return; // Ignore if quiz is still active
      
      this.openEndQuizModal();
      this.quizService.setEndQuizSession(false);
    });
  }

  verifyResponsesComplete(): boolean {
    const isQuizComplete = this.questions.every(q => q.response && q.response.trim() !== '');
    if (isQuizComplete && !this.isUserNotifiedOfQuizCompletion) {
      this.isUserNotifiedOfQuizCompletion = true;
    } else if (!isQuizComplete && this.isUserNotifiedOfQuizCompletion) {
      this.isUserNotifiedOfQuizCompletion = false;
    }
    return isQuizComplete;
  }

  setQuestion(index: number): void {
    this.question = new Question(this.questions[index]);
    this.randomizeOptions(this.question);
  }

  navigateToResults(event: ModalPayload): void {
    if (!event.confirmed) return;

    this.modalInstance.hide();
    this.modalPayload = null;
    this.quizService.setQuestions(this.questions);
    // Ensure navigation occurs after modal is closed
    setTimeout(() => {
      this.router.navigate(['/results']);
    }, 0);
  }

  randomizeOptions(question: Question): void {
    question.options.sort(() => Math.random() - 0.5);
  }

  handleQuestionNavigation(index: number): void {
    this.index = index - 1; // Adjust for the upcoming preincrement in nextQuestion method
    this.nextQuestion();
  }
  
  saveAndNavigate(event: PromptPayload): void {
    this.questions[this.index].response = event.response;
    if (event.retrievePreviousQuestion) {
      this.index -= 2; // Adjust for the upcoming preincrement in nextQuestion method
    } else if (event.clearResponse) {
      this.isUserNotifiedOfQuizCompletion = false;
      this.index -= 1; // Stay on the same question after clearing selection
    }
    this.nextQuestion();
  }

  openEndQuizModal(modalMessage: string = ''): void {
    this.modalPayload = new ModalPayload({ id: 'endQuiz', message: modalMessage != '' ? modalMessage : this.determineModalMessage() });
    this.modalInstance.show();
  }

  determineModalMessage(): string {
    return this.verifyResponsesComplete() ? this.ALL_RESPONSES_COMPLETED_WARNING : this.INCOMPLETE_RESPONSES_WARNING;
  }
}
