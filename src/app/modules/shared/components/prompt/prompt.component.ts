import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PromptPayload } from 'src/app/models/prompt-payload.model';
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

  @Output() retrieveQuestion: EventEmitter<PromptPayload> =
    new EventEmitter<PromptPayload>();

  initialResponse: string = '';

  get codeLines(): string[] {
    return this.question.code ? this.question.code.split('\n') : [];
  }

  constructor() { }

  ngOnInit(): void {
    this.initialResponse = this.question ? this.question.response : '';
  }

  clearSelection(): void {
    if (!this.question || !this.question.response) return;

    const response = '';
    this.retrieveQuestion.emit(new PromptPayload({ response, retrievePreviousQuestion: false, clearResponse: true }));
  }

  goBack(): void {
    if (this.index <= 0) return;

    const response = this.initialResponse;
    this.retrieveQuestion.emit(new PromptPayload({ response, retrievePreviousQuestion: true, clearResponse: false }));
  }

  goForward(): void {
    if (this.index >= this.totalQuestions - 1) return;

    const response = this.initialResponse;
    this.retrieveQuestion.emit(new PromptPayload({ response, retrievePreviousQuestion: false, clearResponse: false }));
  }

  confirmResponse(): void {
    if (!this.question || !this.question.response) return;

    const response = this.question.response;
    this.retrieveQuestion.emit(new PromptPayload({ response, retrievePreviousQuestion: false, clearResponse: false }));
  }
}
