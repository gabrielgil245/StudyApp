import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizSelectionRoutingModule } from './quiz-selection-routing.module';
import { QuizSelectionComponent } from './quiz-selection.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    QuizSelectionComponent
  ],
  imports: [
    CommonModule,
    QuizSelectionRoutingModule,
    SharedModule
  ]
})
export class QuizSelectionModule { }
