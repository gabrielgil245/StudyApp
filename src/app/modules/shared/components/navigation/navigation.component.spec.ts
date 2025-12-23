import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationComponent]
    });
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit navigateToQuestion event when navigateTo is called with a different index', () => {
    const emitSpy = spyOn(component.navigateToQuestion, 'emit');
    component.index = 1;
    component.navigateTo(2);
    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it('should not emit navigateToQuestion event when navigateTo is called with the same index', () => {
    const emitSpy = spyOn(component.navigateToQuestion, 'emit');
    component.index = 1;
    component.navigateTo(1);
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
