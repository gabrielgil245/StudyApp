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

  it('should show button when scrolled down document body scrollTop is greater than 200', () => {
    spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(250);
    component.scrollFunction();
    expect(component.showScrollBackToTopButton).toBeTrue();
  });

  it('should show button when scrolled down document documentElement scrollTop is greater than 200', () => {
    spyOnProperty(document.documentElement, 'scrollTop', 'get').and.returnValue(250);
    component.scrollFunction();
    expect(component.showScrollBackToTopButton).toBeTrue();
  });

  it('should hide button when at top', () => {
    spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(0);
    spyOnProperty(document.documentElement, 'scrollTop', 'get').and.returnValue(0);
    component.scrollFunction();
    expect(component.showScrollBackToTopButton).toBeFalse();
  });

  it('should scroll to top when scrollToTop is called', () => {
    component.showScrollBackToTopButton = true;
    const scrollToSpy = spyOn(window as any, 'scrollTo');
    component.scrollToTop();
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'instant' } as any);
  });

  it('should not scroll to top when showScrollBackToTopButton is false', () => {
    component.showScrollBackToTopButton = false;
    const scrollToSpy = spyOn(window as any, 'scrollTo');
    component.scrollToTop();
    expect(scrollToSpy).not.toHaveBeenCalled();
  });
});
