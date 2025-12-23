import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { ModalPayload } from 'src/app/models/modal-payload.model';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalComponent]
    });
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize modalId and modalMessage on modalPayload change', () => {
    const testPayload = {
      id: 'testId',
      message: 'Test Message'
    };
    component.modalPayload = testPayload;
    component.ngOnChanges({
      modalPayload: {
        currentValue: testPayload,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    expect(component.modalId).toBe('testId');
    expect(component.modalMessage).toBe('Test Message');
  });

  it('should emit confirm event with correct payload on onConfirm', () => {
    const emitSpy = spyOn(component.confirm, 'emit');
    component.modalId = 'testId';
    component.modalMessage = 'Test Message';
    component.onConfirm(true);
    expect(emitSpy).toHaveBeenCalledWith(new ModalPayload({
      id: 'testId',
      message: 'Test Message',
      confirmed: true
    }));
    expect(component.modalId).toBe('');
    expect(component.modalMessage).toBe('');
  });
});
