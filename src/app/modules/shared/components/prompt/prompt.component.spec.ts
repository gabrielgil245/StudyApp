import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptComponent } from './prompt.component';
import { Question } from 'src/app/models/question.model';
import { PromptPayload } from 'src/app/models/prompt-payload.model';

describe('PromptComponent', () => {
  let component: PromptComponent;
  let fixture: ComponentFixture<PromptComponent>;
  let mockQuestion: Question;

  beforeEach(() => {
    mockQuestion = new Question({ text: 'Question 1', options: ['A', 'B', 'C', 'D'], answer: 'A' });
    TestBed.configureTestingModule({
      declarations: [PromptComponent]
    });
    fixture = TestBed.createComponent(PromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty array for codeLines if question.code is undefined', () => {
    component.question = new Question({ text: 'Question without code', options: ['A', 'B'], answer: 'A' });
    expect(component.codeLines).toEqual([]);
  });

  it('should split question.code into lines for codeLines', () => {
    const code: string = 'line1\nline2\nline3';
    component.question = new Question({ text: 'Question with code', options: ['A', 'B'], answer: 'A', code: code });
    expect(component.codeLines).toEqual(['line1', 'line2', 'line3']);
  });

  it('should initialize initialResponse as empty string if question is undefined', () => {
    component.question = undefined as any;
    component.ngOnInit();
    expect(component.initialResponse).toEqual('');
  });
  
  it('should initialize initialResponse on ngOnInit', () => {
    component.question = mockQuestion;
    component.ngOnInit();
    expect(component.initialResponse).toEqual(mockQuestion.response);
  });

  it('should not emit retrieveQuestion if clearSelection is called with no response', () => {
    const emitSpy = spyOn(component.retrieveQuestion, 'emit');
    component.question = mockQuestion;
    component.question.response = '';
    component.clearSelection();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit retrieveQuestion with clearResponse true on clearSelection', () => {
    const emitSpy = spyOn(component.retrieveQuestion, 'emit');
    component.question = mockQuestion;
    component.question.response = 'Some response';
    component.clearSelection();
    expect(emitSpy).toHaveBeenCalledWith(jasmine.objectContaining({ clearResponse: true }));
  });

  it('should not emit retrieveQuestion if goBack is called at index 0', () => {
    const emitSpy = spyOn(component.retrieveQuestion, 'emit');
    component.index = 0;
    component.goBack();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit retrieveQuestion with retrievePreviousQuestion true on goBack', () => {
    const emitSpy = spyOn(component.retrieveQuestion, 'emit');
    component.index = 2;
    component.initialResponse = 'Initial response';
    component.goBack();
    expect(emitSpy).toHaveBeenCalledWith(jasmine.objectContaining({ retrievePreviousQuestion: true }));
  });

  it('should not emit retrieveQuestion if goForward is called at last index', () => {
    const emitSpy = spyOn(component.retrieveQuestion, 'emit');
    component.index = 4;
    component.totalQuestions = 5;
    component.goForward();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit retrieveQuestion with retrievePreviousQuestion false on goForward', () => {
    const emitSpy = spyOn(component.retrieveQuestion, 'emit');
    component.index = 1;
    component.totalQuestions = 5;
    component.initialResponse = 'Initial response';
    component.goForward();
    expect(emitSpy).toHaveBeenCalledWith(jasmine.objectContaining({ retrievePreviousQuestion: false }));
  });

  it('should not emit retrieveQuestion if confirmResponse is called with no response', () => {
    const emitSpy = spyOn(component.retrieveQuestion, 'emit');
    component.question = mockQuestion;
    component.question.response = '';
    component.confirmResponse();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit retrieveQuestion with correct payload on confirmResponse', () => {
    const emitSpy = spyOn(component.retrieveQuestion, 'emit');
    component.question = mockQuestion;
    component.question.response = 'Confirmed response';
    component.confirmResponse();
    expect(emitSpy).toHaveBeenCalledWith(jasmine.objectContaining(new PromptPayload({ response: 'Confirmed response', retrievePreviousQuestion: false, clearResponse: false })));
  });
});
