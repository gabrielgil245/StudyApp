import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Question } from 'src/app/models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questions: Question[] = [];

  private isQuizActiveObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private endQuizSession: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor() { }

  getQuestions(): Question[] {
    return this.questions;
  }
  
  setQuestions(questions: Question[]): void {
    this.questions = questions.map(q => new Question(q));
  }

  getIsQuizActiveObservable() {
    return this.isQuizActiveObservable.asObservable();
  }
  
  setIsQuizActive(isQuizActive: boolean): void {
    this.isQuizActiveObservable.next(isQuizActive);
  }

  getEndQuizSessionObservable() {
    return this.endQuizSession.asObservable();
  }

  setEndQuizSession(endQuizSession: boolean): void {
    this.endQuizSession.next(endQuizSession);
  }
}
