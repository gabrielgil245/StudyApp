import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'scroll-back-to-top-button',
  templateUrl: './scroll-back-to-top.component.html',
  styleUrls: ['./scroll-back-to-top.component.scss']
})
export class ScrollBackToTopComponent {

  readonly THRESHOLD: number = 200;
  
  showScrollBackToTopButton: boolean = false;

  constructor() { }

  @HostListener('window:scroll')
  scrollFunction() {
    this.showScrollBackToTopButton = window.pageYOffset > this.THRESHOLD || document.documentElement.scrollTop > this.THRESHOLD;
  }    
  
  scrollToTop() {
    if (!this.showScrollBackToTopButton) return;

    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}
