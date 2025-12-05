import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizSelectionRoutingModule } from './quiz-selection-routing.module';
import { QuizSelectionComponent } from './quiz-selection.component';

@NgModule({
  declarations: [
    QuizSelectionComponent
  ],
  imports: [
    CommonModule,
    QuizSelectionRoutingModule
  ]
})
export class QuizSelectionModule { }
