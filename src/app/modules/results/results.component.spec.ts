import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ResultsComponent } from './results.component';
import { Router } from '@angular/router';
import { QuizService } from '../core/services/quiz/quiz.service';
import { SharedModule } from '../shared/shared.module';
import { Question } from 'src/app/models/question.model';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let quizServiceSpy: QuizService;
  let routerSpy: Router;
  let mockQuestions: Question[];

  beforeEach(() => {
    mockQuestions = [
      new Question({ text: 'Question 1', options: ['A', 'B', 'C', 'D'], answer: 'A' }),
      new Question({ text: 'Question 2', options: ['A', 'B', 'C', 'D'], answer: 'B' })
    ];
    TestBed.configureTestingModule({
      declarations: [ResultsComponent],
      imports: [SharedModule]
    });
    fixture = TestBed.createComponent(ResultsComponent);
    quizServiceSpy = TestBed.inject(QuizService);
    routerSpy = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not initialize and navigate to /quiz-selection on ngOnInit', () => {
    component.questions = [];
    const navigateSpy = spyOn(routerSpy, 'navigate');
    const retrieveQuestionsSpy = spyOn(component, 'retrieveQuestions');
    component.ngOnInit();
    expect(retrieveQuestionsSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/quiz-selection']);
  });

  it('should successfully initialize on ngOnInit', fakeAsync(() => {
    component.questions = mockQuestions;
    const retrieveQuestionsSpy = spyOn(component, 'retrieveQuestions');
    const calculateScoreSpy = spyOn(component, 'calculateScore').and.returnValue(1);
    component.ngOnInit();
    tick(300);
    expect(retrieveQuestionsSpy).toHaveBeenCalled();
    expect(component.questions).toEqual(mockQuestions);
    expect(calculateScoreSpy).toHaveBeenCalled();
    expect(component.score).toBe(1);
    expect(component.percentage).toBe(50);
    expect(component.isLoading).toBeFalse();
  }));

  it('should retrieve questions', () => {
    const getQuestionsSpy = spyOn(quizServiceSpy, 'getQuestions').and.returnValue(mockQuestions);
    const setIsQuizActiveSpy = spyOn(quizServiceSpy, 'setIsQuizActive');
    const setQuestionsSpy = spyOn(quizServiceSpy, 'setQuestions');
    component.retrieveQuestions();
    expect(getQuestionsSpy).toHaveBeenCalled();
    expect(component.questions).toEqual(mockQuestions);
    expect(setIsQuizActiveSpy).toHaveBeenCalledWith(false);
    expect(setQuestionsSpy).toHaveBeenCalledWith([]);
  });

  it('should calculate score correctly', () => {
    component.questions = mockQuestions;
    component.questions[0].response = 'A'; // Correct
    component.questions[1].response = 'C'; // Incorrect
    // Adding more questions for thorough testing
    component.questions.push(new Question({ text: 'Question 3', options: ['A', 'B', 'C', 'D'], answer: 'C', response: 'c' })); // Correct (case insensitive)
    component.questions.push(new Question({ text: 'Question 4', options: ['A', 'B', 'C', 'D'], answer: 'D', response: ' D ' })); // Correct (trimmed)
    component.questions.push(new Question({ text: 'Question 5', options: ['A', 'B', 'C', 'D'], answer: 'A', response: 'B' })); // Incorrect
    const score = component.calculateScore();
    expect(score).toBe(3); // Q1, Q3, and Q4 are correct
  });

  it('should scroll to the correct question element', () => {
    const el = document.createElement('div');
    el.id = 'question-1';
    document.body.appendChild(el);

    spyOn(el, 'scrollIntoView');
    component.scrollToQuestion(1);
    expect(el.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'instant',
      block: 'start',
    });

    document.body.removeChild(el);
  });

  it ('should not scroll if element not found', () => {
    const getElementByIdSpy = spyOn(document, 'getElementById').and.returnValue(null);
    const scrollIntoViewSpy = jasmine.createSpy('scrollIntoView');
    component.scrollToQuestion(999);
    expect(getElementByIdSpy).toHaveBeenCalledWith('question-999');
    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });
});
