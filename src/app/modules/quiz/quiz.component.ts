import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from 'src/app/models/question.model';
import { QuizService } from 'src/app/modules/core/services/quiz/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  questions: Question[] = [];

  isLoading: boolean = true;

  question: Question | null = null;

  index: number;

  constructor(private quizService: QuizService, private router: Router) {
    this.questions = this.quizService.getQuestions();
    this.index = -1;
  }

  ngOnInit(): void {
    if (!this.questions.length) {
      this.router.navigate(['/quiz-selection']);
      return;
    }
    this.randomizeQuestions();
    this.nextQuestion();
  }

  randomizeQuestions(): void {
    this.questions.sort(() => Math.random() - 0.5);
  }

  nextQuestion(): void {
    this.isLoading = true;
    // Using setTimeout to simulate async loading behavior
    setTimeout(() => {
      if (this.verifyResponsesComplete()) {
        this.navigateToResults();
        return;
      }
      if (this.index >= this.questions.length - 1) this.index = -1;
      this.setQuestion(++this.index);
      this.isLoading = false;
    }, 300);
  }

  verifyResponsesComplete(): boolean {
    return this.questions.every(q => q.response && q.response.trim() !== '');
  }

  setQuestion(index: number): void {
    this.question = new Question(this.questions[index]);
    this.randomizeOptions(this.question);
  }

  navigateToResults(): void {
    this.quizService.setQuestions(this.questions);
    this.router.navigate(['/results']);
  }

  randomizeOptions(question: Question): void {
    question.options.sort(() => Math.random() - 0.5);
  }

  handleQuestionNavigation(event: {response: string, retrievePreviousQuestion: boolean}): void {
    this.questions[this.index].response = event.response;
    if (event.retrievePreviousQuestion) {
      this.index -= 2; // Adjust for the upcoming preincrement in nextQuestion method
    }
    this.nextQuestion();
  }
}
