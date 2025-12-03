import { Injectable } from '@angular/core';
import { Question } from 'src/app/models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questions: Question[] = [];
  
  constructor() { }

  getQuestions(): Question[] {
    return this.questions;
  }
  
  setQuestions(questions: Question[]): void {
    this.questions = questions.map(q => new Question(q));
  }
}
