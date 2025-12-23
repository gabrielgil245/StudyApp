import { TestBed } from '@angular/core/testing';

import { QuizService } from './quiz.service';
import { Question } from 'src/app/models/question.model';

describe('QuizService', () => {
  let service: QuizService;
  let mockQuestions: Question[];

  beforeEach(() => {
    mockQuestions = [
      new Question({ text: 'Question 1', options: ['A', 'B', 'C', 'D'], answer: 'A' }),
      new Question({ text: 'Question 2', options: ['A', 'B', 'C', 'D'], answer: 'B' })
    ];
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get questions', () => {
    service.setQuestions(mockQuestions);
    expect(service.getQuestions()).toEqual(mockQuestions);
  });

  it('should set and get isQuizActive as false', (done) => {
    service.setIsQuizActive(false);
    service.getIsQuizActiveObservable().subscribe(isActive => {
      expect(isActive).toBeFalse();
      done();
    });
  });
  
  it('should set and get isQuizActive as true', (done) => {
    service.setIsQuizActive(true);
    service.getIsQuizActiveObservable().subscribe(isActive => {
      expect(isActive).toBeTrue();
      done();
    });
  });

  it('should set and get endQuizSession as false and false', (done) => {
    service.setEndQuizSession(false, false);
    service.getEndQuizSessionObservable().subscribe(session => {
      expect(session).toEqual({isEnd: false, isTimeUp: false});
      done();
    });
  });

  it('should set and get endQuizSession as true and true', (done) => {
    service.setEndQuizSession(true, true);
    service.getEndQuizSessionObservable().subscribe(session => {
      expect(session).toEqual({isEnd: true, isTimeUp: true});
      done();
    });
  });

  it('should set and get isTimeUp as false', (done) => {
    service.setIsTimeUp(false);
    service.isTimeUpObservable().subscribe(isTimeUp => {
      expect(isTimeUp).toBeFalse();
      done();
    });
  });

  it('should set and get isTimeUp as true', (done) => {
    service.setIsTimeUp(true);
    service.isTimeUpObservable().subscribe(isTimeUp => {
      expect(isTimeUp).toBeTrue();
      done();
    });
  });

  it('should set and get minutes', () => {
    service.setMinutes(45);
    expect(service.getMinutes()).toBe(45);
  });
});
