import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Question } from 'src/app/models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questions: Question[] = [];

  private isQuizActiveObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private endQuizSession: BehaviorSubject<{isEnd: boolean, isTimeUp: boolean}> = new BehaviorSubject<{isEnd: boolean, isTimeUp: boolean}>({isEnd: false, isTimeUp: false});
  
  private isTimeUp: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private minutes: number = 30; // Default to 30 minutes
  
  constructor() { }

  getQuestions(): Question[] {
    return this.questions;
  }
  
  setQuestions(questions: Question[]): void {
    this.questions = questions;
  }

  getIsQuizActiveObservable() {
    return this.isQuizActiveObservable.asObservable();
  }
  
  setIsQuizActive(isQuizActive: boolean): void {
    this.isQuizActiveObservable.next(isQuizActive);
  }

  getEndQuizSessionObservable(): Observable<{isEnd: boolean, isTimeUp: boolean}> {
    return this.endQuizSession.asObservable();
  }

  setEndQuizSession(isEnd: boolean, isTimeUp: boolean): void {
    this.endQuizSession.next({isEnd, isTimeUp});
  }
  
  isTimeUpObservable(): Observable<boolean> {
    return this.isTimeUp.asObservable();
  }

  setIsTimeUp(isTimeUp: boolean): void {
    this.isTimeUp.next(isTimeUp);
  }

  getMinutes(): number {
    return this.minutes;
  }

  setMinutes(minutes: number): void {
    this.minutes = minutes;
  }
}
