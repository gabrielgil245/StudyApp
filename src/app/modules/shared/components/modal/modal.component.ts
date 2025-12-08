import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ModalPayload } from 'src/app/models/modal-payload.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnChanges {

  @Input() modalPayload: ModalPayload | null = null;

  @Output() confirm: EventEmitter<ModalPayload> = new EventEmitter<ModalPayload>();

  modalId: string = '';
  
  modalMessage: string = '';

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modalPayload'] && this.modalPayload) {
      this.modalId = this.modalPayload.id;
      this.modalMessage = this.modalPayload.message;
    }
  }

  onConfirm(confirmed: boolean): void {
    const modalPayload = new ModalPayload({
      id: this.modalId,
      message: this.modalMessage,
      confirmed
    });
    this.modalId = '';
    this.modalMessage = '';
    this.confirm.emit(modalPayload);
  }

}
