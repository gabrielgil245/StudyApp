import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from 'src/app/models/question.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  @Input({ required: true }) questions!: Question[];

  @Input({ required: true }) isQuizActive!: boolean;
  
  @Input() index: number = -1;

  @Output() navigateToQuestion: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  navigateTo(index: number): void {
    if (index === this.index) return;

    this.navigateToQuestion.emit(index);
  }
}
