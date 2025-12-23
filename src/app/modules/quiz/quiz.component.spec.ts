import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { QuizComponent } from './quiz.component';
import { Router } from '@angular/router';
import { QuizService } from '../core/services/quiz/quiz.service';
import { SharedModule } from '../shared/shared.module';
import { Question } from 'src/app/models/question.model';
import { Subscription } from 'rxjs';
import { ModalId } from '../shared/enums/modal.id.enum';
import { ModalPayload } from 'src/app/models/modal-payload.model';
import { PromptPayload } from 'src/app/models/prompt-payload.model';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;
  let quizServiceSpy: QuizService;
  let routerSpy: Router;
  let mockQuestion: Question;
  let mockQuestions: Question[];

  beforeEach(() => {
    mockQuestion = new Question({ prompt: 'Question 1', options: ['A', 'B', 'C', 'D'], answer: 'A' });
    mockQuestions = [mockQuestion];
    mockQuestions.push(new Question({ prompt: 'Question 2', options: ['A', 'B', 'C', 'D'], answer: 'B' }));
    mockQuestions.push(new Question({ prompt: 'Question 3', options: ['A', 'B', 'C', 'D'], answer: 'C' }));
    TestBed.configureTestingModule({
      declarations: [QuizComponent],
      imports: [SharedModule]
    });
    fixture = TestBed.createComponent(QuizComponent);
    quizServiceSpy = TestBed.inject(QuizService);
    routerSpy = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to quiz-selection if no questions', () => {
    spyOn(quizServiceSpy, 'getQuestions').and.returnValue([]);
    const routerNavigateSpy = spyOn(routerSpy, 'navigate');
    const setIsQuizActiveSpy = spyOn(quizServiceSpy, 'setIsQuizActive');
    component.ngOnInit();
    expect(component.questions.length).toBe(0);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/quiz-selection']);
    expect(setIsQuizActiveSpy).not.toHaveBeenCalled();
  });
  
  it('should initialize questions on ngOnInit', () => {
    const setIsQuizActiveSpy = spyOn(quizServiceSpy, 'setIsQuizActive');
    spyOn(quizServiceSpy, 'getQuestions').and.returnValue(mockQuestions);
    component.ngOnInit();
    expect(component.questions.length).toBeGreaterThan(0);
    expect(setIsQuizActiveSpy).toHaveBeenCalledWith(true);
  });

  it('should initialize modalInstance on ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(component.modalInstance).toBeDefined();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    // Initialize subscription
    component.endQuizSessionSubscription$ = new Subscription();
    const unsubscribeSpy = spyOn(component.endQuizSessionSubscription$, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should not throw if subscription is undefined on ngOnDestroy', () => {
    component.endQuizSessionSubscription$ = undefined;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should randomize questions', () => {
    spyOn(Math, 'random').and.returnValues(0.9, 0.1, 0.8);
    component.questions = mockQuestions;
    const originalOrder = [...component.questions];

    component.randomizeQuestions();
    expect(component.questions).not.toEqual(originalOrder);
  });

  it('should open modal with all responses completed warning message', fakeAsync(() => {
    spyOn(component, 'verifyResponsesComplete').and.returnValue(true);
    const spyOpenEndQuizModal = spyOn(component, 'openEndQuizModal');
    component.isUserNotifiedOfQuizCompletion = false;
    
    component.nextQuestion();
    tick(300);
    expect(spyOpenEndQuizModal).toHaveBeenCalledWith(component.ALL_RESPONSES_COMPLETED_WARNING);
    expect(component.isLoading).toBeFalse();
  }));

  it('should proceed to next question if responses not complete', fakeAsync(() => {
    spyOn(component, 'verifyResponsesComplete').and.returnValue(false);
    const spySetQuestion = spyOn(component, 'setQuestion');
    component.index = 0;
    component.questions = mockQuestions;
    
    component.nextQuestion();
    tick(300);
    expect(spySetQuestion).toHaveBeenCalledWith(1);
    expect(component.isLoading).toBeFalse();
  }));

  it('should loop back to first question after last question', fakeAsync(() => {
    spyOn(component, 'verifyResponsesComplete').and.returnValue(false);
    const spySetQuestion = spyOn(component, 'setQuestion');
    component.index = mockQuestions.length - 1; // Set to last question
    component.questions = mockQuestions;
    
    component.nextQuestion();
    tick(300);
    expect(spySetQuestion).toHaveBeenCalledWith(0); // Should loop back to first question
    expect(component.isLoading).toBeFalse();
  }));

  it('should not open end quiz modal when quiz is not ended via subscription', () => {
    const spyOpenEndQuizModal = spyOn(component, 'openEndQuizModal');
    
    component.initializeEndQuizSessionSubscription();
    expect(component.endQuizSessionSubscription$).toBeDefined();
    expect(spyOpenEndQuizModal).not.toHaveBeenCalled();
  });

  it('should open end quiz modal when quiz ends via subscription', () => {
    const spyOpenEndQuizModal = spyOn(component, 'openEndQuizModal');
    const spySetEndQuizSession = spyOn(quizServiceSpy, 'setEndQuizSession');
    
    component.initializeEndQuizSessionSubscription();
    // Simulate quiz end
    (component.endQuizSessionSubscription$ as Subscription).add(
      quizServiceSpy['endQuizSession'].next({ isEnd: true, isTimeUp: false })
    );
    expect(spyOpenEndQuizModal).toHaveBeenCalledWith('');
    expect(spySetEndQuizSession).toHaveBeenCalledWith(false, false);
  });

  it('should open end quiz modal with time up warning when time is up via subscription', () => {
    const spyOpenEndQuizModal = spyOn(component, 'openEndQuizModal');
    const spySetEndQuizSession = spyOn(quizServiceSpy, 'setEndQuizSession');
    
    component.initializeEndQuizSessionSubscription();
    // Simulate quiz end due to time up
    (component.endQuizSessionSubscription$ as Subscription).add(
      quizServiceSpy['endQuizSession'].next({ isEnd: true, isTimeUp: true })
    );
    expect(spyOpenEndQuizModal).toHaveBeenCalledWith(component.TIME_UP_WARNING);
    expect(spySetEndQuizSession).toHaveBeenCalledWith(false, false);
  });

  it('should verify responses are complete and set user notified', () => {
    component.questions = mockQuestions;
    component.questions[0].response = 'A';
    component.questions[1].response = 'B';
    component.questions[2].response = 'C';
    component.isUserNotifiedOfQuizCompletion = false;
    
    expect(component.verifyResponsesComplete()).toBeTrue();
    expect(component.isUserNotifiedOfQuizCompletion).toBeTrue();
  });

  it('should verify responses are incomplete and set user not notified', () => {
    component.questions = mockQuestions;
    component.questions[0].response = 'A';
    component.questions[1].response = '';
    component.questions[2].response = 'C';
    component.isUserNotifiedOfQuizCompletion = true;
    
    expect(component.verifyResponsesComplete()).toBeFalse();
    expect(component.isUserNotifiedOfQuizCompletion).toBeFalse();
  });

  it('should set questions and index when setQuestion is called', () => {
    const spyRandomizeOptions = spyOn(component, 'randomizeOptions');
    component.questions = mockQuestions;
    component.setQuestion(1);

    expect(component.question).toEqual(mockQuestions[1]);
    expect(spyRandomizeOptions).toHaveBeenCalledWith(mockQuestions[1]);
  });

  it('should navigate to results on confirm in modal', fakeAsync(() => {
    component.modalPayload = new ModalPayload({ id: 'ModalId', message: 'Test Message', confirmed: false });
    const spyNavigate = spyOn(routerSpy, 'navigate');
    spyOn(component.modalInstance, 'hide');
    spyOn(quizServiceSpy, 'setQuestions');

    component.navigateToResults(new ModalPayload({ id: '', message: '', confirmed: true }));
    tick(0);
    expect(component.modalPayload).toBeNull();
    expect(spyNavigate).toHaveBeenCalledWith(['/results']);
  }));

  it('should not navigate to results on cancel in modal', () => {
    component.modalPayload = new ModalPayload({ id: 'ModalId', message: 'Test Message', confirmed: false });
    const spyHide = spyOn(component.modalInstance, 'hide');

    component.navigateToResults(new ModalPayload({ id: '', message: '', confirmed: false }));
    expect(spyHide).not.toHaveBeenCalled();
    expect(component.modalPayload).not.toBeNull();
  });

  it('should randomize options of a question', () => {
    const question = mockQuestion;
    spyOn(Math, 'random').and.returnValues(0.9, 0.1, 0.8, 0.4);
    const originalOptions = [...question.options];

    component.randomizeOptions(question);
    expect(question.options).not.toEqual(originalOptions);
  });

  it('should handle question navigation correctly', () => {
    const spyNextQuestion = spyOn(component, 'nextQuestion');
    component.handleQuestionNavigation(2);
    expect(component.index).toBe(1); // Adjusted index
    expect(spyNextQuestion).toHaveBeenCalled();
  });

  it('should save response and navigate correctly', () => {
    const spyNextQuestion = spyOn(component, 'nextQuestion');
    component.questions = mockQuestions;
    component.index = 1;
    
    component.saveAndNavigate(new PromptPayload({ response: 'B', retrievePreviousQuestion: false, clearResponse: false }));
    expect(component.questions[1].response).toBe('B');
    expect(component.index).toBe(1);
    expect(spyNextQuestion).toHaveBeenCalled();
  });

  it('should save response and retrieve previous question', () => {
    const spyNextQuestion = spyOn(component, 'nextQuestion');
    component.questions = mockQuestions;
    component.index = 2;
    
    component.saveAndNavigate(new PromptPayload({ response: 'C', retrievePreviousQuestion: true, clearResponse: false }));
    expect(component.questions[2].response).toBe('C');
    expect(component.index).toBe(0); // Adjusted index
    expect(spyNextQuestion).toHaveBeenCalled();
  });

  it('should save response and clear current response', () => {
    const spyNextQuestion = spyOn(component, 'nextQuestion');
    component.questions = mockQuestions;
    component.index = 1;
    component.isUserNotifiedOfQuizCompletion = true;
    
    component.saveAndNavigate(new PromptPayload({ response: 'A', retrievePreviousQuestion: false, clearResponse: true }));
    expect(component.questions[1].response).toBe('A');
    expect(component.index).toBe(0); // Adjusted index
    expect(component.isUserNotifiedOfQuizCompletion).toBeFalse();
    expect(spyNextQuestion).toHaveBeenCalled();
  });

  it('should open end quiz modal with correct message and id', () => {
    const spyShow = spyOn(component.modalInstance, 'show');
    
    component.openEndQuizModal(component.TIME_UP_WARNING);
    expect(component.modalPayload?.message).toBe(component.TIME_UP_WARNING);
    expect(component.modalPayload?.id).toBe(ModalId.TIME_UP);
    expect(spyShow).toHaveBeenCalled();
  });

  it('should open end quiz modal with default message and id', () => {
    const spyShow = spyOn(component.modalInstance, 'show');
    const spyDetermineModalMessage = spyOn(component, 'determineModalMessage').and.returnValue('Default Message');

    component.openEndQuizModal();
    expect(spyDetermineModalMessage).toHaveBeenCalled();
    expect(component.modalPayload?.message).toBe(component.determineModalMessage());
    expect(component.modalPayload?.id).toBe(ModalId.END_QUIZ);
    expect(spyShow).toHaveBeenCalled();
  });

  it('should determine modal message based on quiz completion', () => {
    spyOn(component, 'verifyResponsesComplete').and.returnValue(true);
    expect(component.determineModalMessage()).toBe(component.ALL_RESPONSES_COMPLETED_WARNING);
  });

  it('should determine modal message based on quiz incomplete', () => {
    spyOn(component, 'verifyResponsesComplete').and.returnValue(false);
    expect(component.determineModalMessage()).toBe(component.INCOMPLETE_RESPONSES_WARNING);
  });
});
