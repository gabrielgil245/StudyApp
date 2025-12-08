import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz/quiz.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input( {required: true} ) title!: string;

  isQuizActive: boolean = false;

  isQuizActiveSubscription$: Subscription | undefined;

  constructor(public quizService: QuizService) { }

  ngOnInit(): void {
    this.isQuizActiveSubscription$ = this.quizService.getIsQuizActiveObservable().subscribe((isActive: boolean) => {
      this.isQuizActive = isActive;
    });
  }

  ngOnDestroy(): void {
    this.isQuizActiveSubscription$?.unsubscribe();
  }

  endQuiz() {
    this.quizService.setEndQuizSession(true);
  }
}
