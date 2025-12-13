import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz/quiz.service';
import { interval, Subject, Subscription, takeUntil, takeWhile } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input({ required: true }) title!: string;

  isQuizActive: boolean = false;

  timeLeftSeconds: number = 1800000; // default 30 minutes in milliseconds 1000 * 60 * 30

  timerStarted: boolean = false;

  isQuizActiveSubscription$: Subscription | undefined;

  isTimeUpSubscription$: Subscription | undefined;

  timerSubscription$: Subscription | undefined;

  destroy$: Subject<void> = new Subject<void>();

  constructor(public quizService: QuizService) { }

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeSubscriptions(): void {
    this.initializeIsQuizActiveSubscription();
    this.initializeIsTimeUpSubscription();
  }

  initializeIsQuizActiveSubscription(): void {
    this.isQuizActiveSubscription$ = this.quizService.getIsQuizActiveObservable().pipe(takeUntil(this.destroy$)).subscribe((isActive: boolean) => {
      this.isQuizActive = isActive;
      console.log('Quiz Active Status Changed:', this.isQuizActive);
      if (!this.isQuizActive) {
        this.timeLeftSeconds = 1800000; // Reset to default 30 minutes in milliseconds
        this.stopTimer();
      } else {
        this.initializeTimerSubscription();
      }
    });
  }

  initializeIsTimeUpSubscription(): void {
    this.isTimeUpSubscription$ = this.quizService.isTimeUpObservable().pipe(takeUntil(this.destroy$)).subscribe((isTimeUp: boolean) => {
      if (this.isQuizActive && isTimeUp) {
        this.endQuiz(isTimeUp);
      }
    });
  }

  initializeTimerSubscription(): void {
    if (this.timerStarted) {
      return;
    }
    
    this.timerStarted = true;
    this.timerSubscription$ = interval(1000).pipe(takeWhile(() => this.timeLeftSeconds > 0), takeUntil(this.destroy$)).subscribe(() => {
      this.timeLeftSeconds -= 1000;

      if (this.timeLeftSeconds <= 0) {
        this.stopTimer();
        this.quizService.setIsTimeUp(true);
      }
    });
  }

  stopTimer(): void {
    this.timerSubscription$?.unsubscribe();
    this.timerSubscription$ = undefined;
    this.timerStarted = false;
  }

  endQuiz(isTimeUp: boolean = false): void {
    this.quizService.setEndQuizSession(true, isTimeUp);
  }
}
