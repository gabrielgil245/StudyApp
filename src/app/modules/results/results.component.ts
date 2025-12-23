import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from 'src/app/models/question.model';
import { QuizService } from 'src/app/modules/core/services/quiz/quiz.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  readonly ACCORDION_ID: string = 'question-navigation';

  readonly ACCORDION_TITLE: string = 'Question Navigation';
  
  questions: Question[] = [];

  isLoading: boolean = true;

  score: number = 0;

  percentage: number = 0;

  constructor(private quizService: QuizService, private router: Router) { }

  ngOnInit(): void {
    this.retrieveQuestions();
    if (!this.questions.length) {
      this.router.navigate(['/quiz-selection']);
      return;
    }
    
    setTimeout(() => {
      this.score = this.calculateScore();
      this.percentage = (this.score / this.questions.length) * 100;
      this.isLoading = false;
    }, 300);
  }

  retrieveQuestions(): void {
    this.questions = this.quizService.getQuestions();
    this.quizService.setIsQuizActive(false);
    this.quizService.setQuestions([]);
  }

  calculateScore(): number {
    let score: number = 0;
    this.questions.forEach(q => {
      if (q.response && q.response.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
        score++;
      }
    });
    return score;
  }

  scrollToQuestion(index: number): void {
    const element: HTMLElement | null = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }
}
