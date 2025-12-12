import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent {
  @Input({ required: true }) id: string = '';

  @Input({ required: true }) title: string = '';

  constructor() { }
}
