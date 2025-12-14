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

  readonly DEFAULT_TIME_MINUTES: number = 60 * 30; // 30 minutes in seconds

  isQuizActive: boolean = false;

  timeLeftSeconds: number;

  timerStarted: boolean = false;

  isQuizActiveSubscription$: Subscription | undefined;

  isTimeUpSubscription$: Subscription | undefined;

  timerSubscription$: Subscription | undefined;

  destroy$: Subject<void> = new Subject<void>();

  constructor(public quizService: QuizService) {
    this.timeLeftSeconds = this.DEFAULT_TIME_MINUTES;
  }

  /**
   * Get the hours portion by calculating total hours from time left in seconds
   */
  get hours(): string {
    return Math.floor(this.timeLeftSeconds / (3600)) // Divide by 3600 to get total hours
      .toString()
      .padStart(2, '0');
  }
  
  /**
   * Get the minutes portion by calculating the remaining minutes after extracting hours
   */
  get minutes(): string {
    return Math.floor((this.timeLeftSeconds % 3600) / 60) // Remainder after dividing by 3600 gives remaining seconds, divide by 60 to get minutes
      .toString()
      .padStart(2, '0');
  }

  /**
   * Get the seconds portion by calculating the remaining seconds after extracting minutes
   */
  get seconds(): string {
    return (this.timeLeftSeconds % 60) // Remainder after dividing by 60 gives remaining seconds
      .toString()
      .padStart(2, '0');
  }


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
      if (!this.isQuizActive) {
        this.timeLeftSeconds = this.DEFAULT_TIME_MINUTES; // Reset to default 30 minutes in seconds
        this.stopTimer();
      } else {
        this.timeLeftSeconds = this.quizService.getMinutes() * 60; // Set time left based on quiz service minutes
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
    if (this.timerStarted) return;
    
    this.timerStarted = true;
    this.timerSubscription$ = interval(1000).pipe(takeWhile(() => this.timeLeftSeconds > 0), takeUntil(this.destroy$)).subscribe(() => {
      this.timeLeftSeconds--; // Decrement time left by 1 second
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
