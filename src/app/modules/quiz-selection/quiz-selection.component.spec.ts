import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSelectionComponent } from './quiz-selection.component';
import { QuizService } from '../core/services/quiz/quiz.service';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { Question } from 'src/app/models/question.model';
import { QuizSelectionError } from './enums/quiz-selection.error.enum';

describe('QuizSelectionComponent', () => {
  let component: QuizSelectionComponent;
  let fixture: ComponentFixture<QuizSelectionComponent>;
  let quizServiceSpy: QuizService;
  let routerSpy: Router;
  let mockQuestion: Question;
  let mockFile: any;

  beforeEach(() => {
    mockQuestion = new Question({ prompt: 'Question 1', options: ['A', 'B', 'C', 'D'], answer: 'A' });
    mockFile = {
      "questions": [
        {
          "id": "1",
          "prompt": "What is HTML5?",
          "code": "",
          "options": [
            "A programming language",
            "A markup language for structuring and presenting content on the web",
            "A database management system",
            "A web server software"
          ],
          "answer": "A markup language for structuring and presenting content on the web",
          "category": "Technology",
          "difficulty": "Easy",
          "explanation": "HTML5 is the latest version of the Hypertext Markup Language used for structuring and presenting content on the web.",
          "response": ""
        }
      ]
    };
    TestBed.configureTestingModule({
      declarations: [QuizSelectionComponent],
      imports: [SharedModule]
    });
    fixture = TestBed.createComponent(QuizSelectionComponent);
    quizServiceSpy = TestBed.inject(QuizService);
    routerSpy = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty questions in quiz service on ngOnInit', () => {
    const setQuestionsSpy = spyOn(quizServiceSpy, 'setQuestions');
    component.ngOnInit();
    expect(setQuestionsSpy).toHaveBeenCalledWith([]);
  });

  it('should set error message as empty string on file selected when files are invalid', () => {
    const errorMessage: string = 'Test Error Message';
    component.errorMessage = errorMessage;
    const event = { target: { name: 'test.json' } } as any;
    component.onFileSelected(event as Event);
    expect(component.errorMessage).not.toBe(errorMessage);
  });

  it('should set error message as empty string on file selected when there are no files selected', () => {
    const errorMessage: string = 'Test Error Message';
    component.errorMessage = errorMessage;
    const event = { target: { files: [] } } as any;
    component.onFileSelected(event as Event);
    expect(component.errorMessage).not.toBe(errorMessage);
  });

  it('should set error message on file selected when there is an invalid file', () => {
    const spyValidateFile = spyOn(component, 'validateFile').and.returnValue('Test Error Message');
    const errorMessage: string = 'Test Error Message';
    component.errorMessage = errorMessage;
    const event = {
      target: {
        files: [
          {
            name: 'test.json',
            type: 'text/plain'
          }
        ]
      }
    } as any;
    component.onFileSelected(event as Event);
    expect(spyValidateFile).toHaveBeenCalled();
    expect(component.errorMessage).toBe(errorMessage);
  });

  it('should parse quiz file correctly', () => {
    const spyValidateFile = spyOn(component, 'validateFile').and.returnValue('');
    const spyParseQuiz = spyOn(component, 'parseQuizFile');
    const fileContent = JSON.stringify({ valid: 'data' });
    const file = new File([fileContent], 'test.json', { type: 'application/json' });
    const event = {
      target: { files: [file] }
    } as unknown as Event;
    const mockFileReader = jasmine.createSpyObj('FileReader', ['readAsText', 'onload']);
    spyOn(window as any, 'FileReader').and.returnValue(mockFileReader);

    component.onFileSelected(event);

    // Set the result property from readAsText event and trigger onload
    mockFileReader.result = fileContent;
    mockFileReader.onload();

    expect(spyValidateFile).toHaveBeenCalledWith(file);
    expect(spyParseQuiz).toHaveBeenCalled();
    expect(component.errorMessage).toBe('');
  });

  it('should parse quiz file with exception', () => {
    const spyValidateFile = spyOn(component, 'validateFile').and.returnValue('');
    const spyParseQuiz = spyOn(component, 'parseQuizFile').and.throwError('Test Error');    
    const fileContent = JSON.stringify({ valid: 'data' });
    const file = new File([fileContent], 'test.json', { type: 'application/json' });
    const event = {
      target: { files: [file] }
    } as unknown as Event;
    const mockFileReader = jasmine.createSpyObj('FileReader', ['readAsText', 'onload']);
    spyOn(window as any, 'FileReader').and.returnValue(mockFileReader);
    
    component.onFileSelected(event);

    // Set the result property from readAsText event and trigger onload
    mockFileReader.result = fileContent;
    mockFileReader.onload();

    expect(spyValidateFile).toHaveBeenCalledWith(file);
    expect(spyParseQuiz).toHaveBeenCalled();
    expect(component.errorMessage).toBe(QuizSelectionError.JSON_PARSE_ERROR);
  });

  it('should set error message as invalid file type when file type is invalid', () => {
    const errorMessage: string = QuizSelectionError.INVALID_FILE_TYPE;
    const event = {
      target: {
        files: [
          {
            name: 'test.json',
            type: 'text/plain'
          }
        ]
      }
    } as any;
    const file = event.target.files[0];
    expect(component.validateFile(file as File)).toBe(errorMessage);
  });

  it('should set error message as invalid file type when file type is invalid', () => {
    const errorMessage: string = QuizSelectionError.INVALID_FILE_TYPE;
    const event = {
      target: {
        files: [
          {
            name: 'test.txt',
            type: 'application/json'
          }
        ]
      }
    } as any;
    const file = event.target.files[0];
    expect(component.validateFile(file as File)).toBe(errorMessage);
  });

  it('should set error message as file already uploaded when file is already uploaded', () => {
    const errorMessage: string = QuizSelectionError.FILE_ALREADY_UPLOADED;
    component.quizzes.set('test.json', []);
    const event = {
      target: {
        files: [
          {
            name: 'test.json',
            type: 'application/json'
          }
        ]
      }
    } as any;
    const file = event.target.files[0];
    expect(component.validateFile(file as File)).toBe(errorMessage);
  });

  it('should parse quiz file and set questions and quizzes correctly', () => {
    const fileContent = JSON.stringify(mockFile);
    const fileName = 'test.json';
    spyOn(component, 'validateQuiz').and.returnValue('');

    component.parseQuizFile(fileContent, fileName);
    expect(component.errorMessage).toBe('');
    expect(component.questions.length).toBe(mockFile.questions.length);
    expect(component.quizzes.has(fileName)).toBeTrue();
    expect(component.quizzes.get(fileName)?.length).toBe(mockFile.questions.length);
  });

  it('should set error message as invalid quiz format missing questions when quiz format is invalid', () => {
    const errorMessage: string = 'Test Error Message';
    const invalidQuiz = { invalid: 'data' };
    spyOn(component, 'validateQuiz').and.returnValue(errorMessage);

    component.parseQuizFile(JSON.stringify(invalidQuiz), 'test.json');
    expect(component.errorMessage).toBe(errorMessage);
    expect(component.questions.length).toBe(0);
    expect(component.quizzes.size).toBe(0);
  });

  it('should set error message as max questions reached when max questions are reached', () => {
    const errorMessage: string = QuizSelectionError.MAX_QUESTIONS_REACHED;
    const fileContent: string = JSON.stringify({
      questions: Array(component.MAX_QUESTIONS).fill(mockQuestion)
    });
    const fileName = 'test.json';
    spyOn(component, 'validateQuiz').and.returnValue('');

    component.parseQuizFile(fileContent, fileName);
    expect(component.errorMessage).toBe(errorMessage);
  });

  it('should set error message as max questions reached when max questions are exceeded', () => {
    const errorMessage: string = QuizSelectionError.MAX_QUESTIONS_REACHED;
    const fileContent: string = JSON.stringify({
      questions: Array(component.MAX_QUESTIONS + 1).fill(mockQuestion)
    });
    const fileName = 'test.json';
    spyOn(component, 'validateQuiz').and.returnValue('');

    component.parseQuizFile(fileContent, fileName);
    expect(component.errorMessage).toBe(errorMessage);
  });

  it('should validate quiz and return empty string for valid quiz', () => {
    const validQuiz = {
      questions: [mockQuestion]
    };
    const result = component.validateQuiz(validQuiz);
    expect(result).toBe('');
  });

  it('should validate quiz and return invalid quiz format missing questions for invalid quiz', () => {
    const errorMessage: string = QuizSelectionError.INVALID_QUIZ_FORMAT_MISSING_QUESTIONS;
    const invalidQuiz = { invalid: 'data' };
    const result = component.validateQuiz(invalidQuiz);
    expect(result).toBe(errorMessage);
  });

  it('should validate quiz and return quiz contains no questions for quiz with no questions', () => {
    const errorMessage: string = QuizSelectionError.QUIZ_CONTAINS_NO_QUESTIONS;
    const invalidQuiz = { questions: [] };
    const result = component.validateQuiz(invalidQuiz);
    expect(result).toBe(errorMessage);
  });

  it('should validate quiz and return invalid quiz format missing properties for quiz with missing properties', () => {
    const errorMessage: string = QuizSelectionError.INVALID_QUIZ_FORMAT_MISSING_PROPERTIES;
    const invalidQuiz = {
      questions: [
        { prompt: 'Question 1', options: ['A', 'B', 'C', 'D'] } // Missing answer
      ]
    };
    const result = component.validateQuiz(invalidQuiz);
    expect(result).toBe(errorMessage);
  });

  it('should validate quiz and return invalid quiz format insufficient options for quiz with insufficient options', () => {
    const errorMessage: string = QuizSelectionError.INVALID_QUIZ_FORMAT_INSUFFICIENT_OPTIONS;
    const invalidQuiz = {
      questions: [
        { prompt: 'Question 1', options: ['A'], answer: 'A' } // Only one option
      ]
    };
    const result = component.validateQuiz(invalidQuiz);
    expect(result).toBe(errorMessage);
  });

  it('should validate quiz and return invalid quiz format answer not in options for quiz with answer not in options', () => {
    const errorMessage: string = QuizSelectionError.INVALID_QUIZ_FORMAT_ANSWER_NOT_IN_OPTIONS;
    const invalidQuiz = {
      questions: [
        { prompt: 'Question 1', options: ['A', 'B', 'C', 'D'], answer: 'E' } // Answer not in options
      ]
    };
    const result = component.validateQuiz(invalidQuiz);
    expect(result).toBe(errorMessage);
  });

  it('should validate quiz and return exceeds question limit for quiz exceeding max questions', () => {
    const errorMessage: string = `${QuizSelectionError.EXCEEDS_QUESTION_LIMIT}${component.MAX_QUESTIONS}.`;
    const invalidQuiz = {
      questions: Array(component.MAX_QUESTIONS + 1).fill(mockQuestion)
    };
    const result = component.validateQuiz(invalidQuiz);
    expect(result).toBe(errorMessage);
  });

  it('should clear files correctly', () => {
    component.quizzes.set('test.json', [mockQuestion]);
    component.questions.push(mockQuestion);
    component.errorMessage = 'Test Error Message';

    component.clearFiles();
    expect(component.quizzes.size).toBe(0);
    expect(component.questions.length).toBe(0);
    expect(component.errorMessage).toBe('');
  });

  it('should not clear files when there are no quizzes', () => {
    component.quizzes.clear();
    component.questions.push(mockQuestion);
    component.errorMessage = 'Test Error Message';

    component.clearFiles();
    expect(component.quizzes.size).toBe(0);
    expect(component.questions.length).toBe(1);
    expect(component.errorMessage).toBe('Test Error Message');
  });

  it('should navigate to quiz on start quiz', () => {
    const navigateSpy = spyOn(routerSpy, 'navigate');
    component.questions = [mockQuestion];

    component.startQuiz();
    expect(navigateSpy).toHaveBeenCalledWith(['/quiz']);
  });

  it('should not start quiz when there are no questions', () => {
    const navigateSpy = spyOn(routerSpy, 'navigate');
    component.questions = [];
    component.startQuiz();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should not start quiz when minutes are less than min minutes', () => {
    const navigateSpy = spyOn(routerSpy, 'navigate');
    component.questions = [mockQuestion];
    component.minutes = component.MIN_MINUTES - 1;
    component.startQuiz();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should not start quiz when minutes are more than max minutes', () => {
    const navigateSpy = spyOn(routerSpy, 'navigate');
    component.questions = [mockQuestion];
    component.minutes = component.MAX_MINUTES + 1;
    component.startQuiz();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should remove file correctly', () => {
    const fileName = 'test.json';
    component.quizzes.set(fileName, [mockQuestion]);
    component.questions.push(mockQuestion);
    component.errorMessage = 'Test Error Message';

    component.removeFile(fileName);
    expect(component.quizzes.size).toBe(0);
    expect(component.questions.length).toBe(0);
    expect(component.errorMessage).toBe('');
  });

  it('should not remove file when file does not exist', () => {
    const fileName = 'nonexistent.json';
    component.quizzes.clear();
    component.questions.push(mockQuestion);
    component.errorMessage = 'Test Error Message';

    component.removeFile(fileName);
    expect(component.quizzes.size).toBe(0);
    expect(component.questions.length).toBe(1);
    expect(component.errorMessage).toBe('Test Error Message');
  });
});