import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from 'src/app/models/question.model';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {
  @Input({ required: true }) question!: Question;

  @Input({ required: true }) enableQuizNavigation!: boolean;

  @Input() index: number = -1;

  @Input() totalQuestions: number = 0;

  @Output() retrieveQuestion: EventEmitter<{ response: string, retrievePreviousQuestion: boolean }> = new EventEmitter<{ response: string, retrievePreviousQuestion: boolean }>();

  initialResponse: string = '';

  constructor() { }
  
  ngOnInit(): void {
    this.initialResponse = this.question.response;
  }

  clearSelection(): void {
    if (!this.question) return;

    this.initialResponse = '';
    this.question.response = '';
  }

  goBack(): void {
    if (this.index <= 0) return;

    this.retrieveQuestion.emit({ response: this.initialResponse, retrievePreviousQuestion: true });
  }

  goForward(): void {
    if (this.index >= this.totalQuestions - 1) return;

    this.retrieveQuestion.emit({ response: this.initialResponse, retrievePreviousQuestion: false });
  }

  confirmResponse(): void {
    if (!this.question || !this.question.response) return;

    this.retrieveQuestion.emit({ response: this.question.response, retrievePreviousQuestion: false });
  }
}
