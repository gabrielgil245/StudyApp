import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { QuizService } from '../../services/quiz/quiz.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let quizServiceMock: QuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    quizServiceMock = TestBed.inject(QuizService);
    component.title = 'Test Title';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title input set', () => {
    expect(component.title).toBe('Test Title');
  });

  it('should initilize with default time', () => {
    expect(component.timeLeftInSeconds).toBe(component.DEFAULT_TIME_IN_SECONDS);
  });

  it('should format hours correctly', () => {
    component.timeLeftInSeconds = 3661; // 1 hour, 1 minute, 1 second
    expect(component.hours).toBe('01');
  });

  it('should format minutes correctly', () => {
    component.timeLeftInSeconds = 3599; // 59 minutes, 59 seconds
    expect(component.minutes).toBe('59');
  });

  it('should format seconds correctly', () => {
    component.timeLeftInSeconds = 3598; // 59 minutes, 58 seconds
    expect(component.seconds).toBe('58');
  });

  it('should call subscriptions on init', () => {
    const quizServiceSpy = spyOn(component, 'initializeSubscriptions');
    component.ngOnInit();
    expect(quizServiceSpy).toHaveBeenCalled();
  });

  it('should clean up subscriptions on destroy', () => {
    const nextSpy = spyOn(component.destroy$, 'next').and.callThrough();
    const completeSpy = spyOn(component.destroy$, 'complete').and.callThrough();
    component.ngOnInit();
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should call subscriptions initializer', () => {
    const isQuizActiveSpy = spyOn(component, 'initializeIsQuizActiveSubscription');
    const isTimeUpSpy = spyOn(component, 'initializeIsTimeUpSubscription');
    component.initializeSubscriptions();
    expect(isQuizActiveSpy).toHaveBeenCalled();
    expect(isTimeUpSpy).toHaveBeenCalled();
  });

  it('should initialize isQuizActive subscription', () => {
    const quizServiceObservableSpy = spyOn(quizServiceMock, 'getIsQuizActiveObservable').and.returnValue({
      pipe: () => ({
        subscribe: (callback: (isActive: boolean) => void) => {
          callback(false);
        }
      })
    } as any);
    const stopTimerSpy = spyOn(component, 'stopTimer');
    component.initializeIsQuizActiveSubscription();
    expect(quizServiceObservableSpy).toHaveBeenCalled();
    expect(stopTimerSpy).toHaveBeenCalled();
    expect(component.timeLeftInSeconds).toBe(1800);
  });

  it('should initialize isQuizActive subscription and start timer', () => {
    const getIsQuizActiveObservableSpy = spyOn(quizServiceMock, 'getIsQuizActiveObservable').and.returnValue({
      pipe: () => ({
        subscribe: (callback: (isActive: boolean) => void) => {
          callback(true);
        }
      })
    } as any);
    const getMinutesSpy = spyOn(quizServiceMock, 'getMinutes').and.returnValue(20);
    const initializeTimerSpy = spyOn(component, 'initializeTimerSubscription');
    component.initializeIsQuizActiveSubscription();
    expect(getIsQuizActiveObservableSpy).toHaveBeenCalled();
    expect(getMinutesSpy).toHaveBeenCalled();
    expect(initializeTimerSpy).toHaveBeenCalled();
    expect(component.timeLeftInSeconds).toBe(1200); // 20 minutes in seconds
  });

  it('should initialize isTimeUp subscription and not end quiz', () => {
    const isTimeUpObservableSpy = spyOn(quizServiceMock, 'isTimeUpObservable').and.returnValue({
      pipe: () => ({
        subscribe: (callback: (isTimeUp: boolean) => void) => {
          callback(false);
        }
      })
    } as any);
    const endQuizSpy = spyOn(component, 'endQuiz');
    component.isQuizActive = false;
    component.initializeIsTimeUpSubscription();
    expect(isTimeUpObservableSpy).toHaveBeenCalled();
    expect(endQuizSpy).not.toHaveBeenCalled();
  });

  it('should initialize isTimeUp subscription and end quiz if time is up', () => {
    const endQuizSpy = spyOn(component, 'endQuiz');
    const isTimeUpObservableSpy = spyOn(quizServiceMock, 'isTimeUpObservable').and.returnValue({
      pipe: () => ({
        subscribe: (callback: (isTimeUp: boolean) => void) => {
          callback(true);
        }
      })
    } as any);
    component.isQuizActive = true;
    component.initializeIsTimeUpSubscription();
    expect(isTimeUpObservableSpy).toHaveBeenCalled();
    expect(endQuizSpy).toHaveBeenCalledWith(true);
  });

  it('should not start timer if already started', () => {
    component.timerStarted = true;
    component.initializeTimerSubscription();
    expect(component.timerSubscription$).toBeUndefined();
  });

  it('should start timer subscription', fakeAsync(() => {
    const setIntervalSpy = spyOn(window, 'setInterval').and.callThrough();
    component.timerStarted = false;
    component.timeLeftInSeconds = 5;
    component.initializeTimerSubscription();
    tick(3000); // Simulate 3 seconds
    component.ngOnDestroy(); // Clean up
    expect(setIntervalSpy).toHaveBeenCalled();
    expect(component.timerStarted).toBeTrue();
    expect(component.timeLeftInSeconds).toBe(2);
  }));

  it('should start timer subscription and stop it', fakeAsync(() => {
    const stopTimerSpy = spyOn(component, 'stopTimer');
    const setIsTimeUpSpy = spyOn(quizServiceMock, 'setIsTimeUp');
    component.timeLeftInSeconds = 10;
    component.initializeTimerSubscription();
    tick(11000); // Simulate 11 seconds
    component.ngOnDestroy(); // Clean up
    expect(component.timerSubscription$).toBeDefined();
    expect(component.timeLeftInSeconds).toBe(0);
    expect(stopTimerSpy).toHaveBeenCalled();
    expect(setIsTimeUpSpy).toHaveBeenCalledWith(true);
  }));

  it('should stop timer subscription', () => {
    component.timerStarted = true;
    component.initializeTimerSubscription();
    component.stopTimer();
    expect(component.timerSubscription$).toBeUndefined();
    expect(component.timerStarted).toBeFalse();
  });

  it('should manually end quiz', () => {
    const setEndQuizSessionSpy = spyOn(quizServiceMock, 'setEndQuizSession');
    component.endQuiz();
    expect(setEndQuizSessionSpy).toHaveBeenCalledWith(true, false);
  });

  it('should end quiz via timer', () => {
    const setEndQuizSessionSpy = spyOn(quizServiceMock, 'setEndQuizSession');
    component.endQuiz(true);
    expect(setEndQuizSessionSpy).toHaveBeenCalledWith(true, true);
  });

});
