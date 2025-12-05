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

  @Output() retrieveQuestion: EventEmitter<{ response: string, retrievePreviousQuestion: boolean, isClearSelection: boolean }> =
    new EventEmitter<{ response: string, retrievePreviousQuestion: boolean, isClearSelection: boolean }>();

  initialResponse: string = '';

  constructor() { }

  ngOnInit(): void {
    this.initialResponse = this.question.response;
  }

  clearSelection(): void {
    if (!this.question || !this.question.response) return;

    const response = '';
    this.retrieveQuestion.emit({ response, retrievePreviousQuestion: false, isClearSelection: true });
  }

  goBack(): void {
    if (this.index <= 0) return;

    const response = this.initialResponse;
    this.retrieveQuestion.emit({ response, retrievePreviousQuestion: true, isClearSelection: false });
  }

  goForward(): void {
    if (this.index >= this.totalQuestions - 1) return;

    const response = this.initialResponse;
    this.retrieveQuestion.emit({ response, retrievePreviousQuestion: false, isClearSelection: false });
  }

  confirmResponse(): void {
    if (!this.question || !this.question.response) return;

    const response = this.question.response;
    this.retrieveQuestion.emit({ response, retrievePreviousQuestion: false, isClearSelection: false });
  }
}
