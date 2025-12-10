import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollBackToTopComponent } from './scroll-back-to-top.component';

describe('ScrollBackToTopComponent', () => {
  let component: ScrollBackToTopComponent;
  let fixture: ComponentFixture<ScrollBackToTopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrollBackToTopComponent]
    });
    fixture = TestBed.createComponent(ScrollBackToTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
