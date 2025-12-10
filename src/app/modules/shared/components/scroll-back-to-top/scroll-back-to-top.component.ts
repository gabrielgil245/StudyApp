import { Component } from '@angular/core';

@Component({
  selector: 'scroll-back-to-top-button',
  templateUrl: './scroll-back-to-top.component.html',
  styleUrls: ['./scroll-back-to-top.component.scss']
})
export class ScrollBackToTopComponent {

  scrollBackToTopButton: HTMLElement | null = null;

  constructor() {
    this.initializeScrollListener();
  }
  
  ngAfterViewInit(): void {
    this.scrollBackToTopButton = document.getElementById('scrollBackToTopButton');
  }

  initializeScrollListener() {
    window.onscroll = () => { this.scrollFunction(); };
  }

  scrollFunction() {
    if (!this.scrollBackToTopButton) return;

    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      this.scrollBackToTopButton.style.display = 'block';
    } else {
      this.scrollBackToTopButton.style.display = 'none';
    }
  }    
  
  scrollToTop() {
    if (!this.scrollBackToTopButton) return;

    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}
