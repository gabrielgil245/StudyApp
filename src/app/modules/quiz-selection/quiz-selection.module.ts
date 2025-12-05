import { NgModule } from '@angular/core';

import { QuizSelectionRoutingModule } from './quiz-selection-routing.module';
import { QuizSelectionComponent } from './quiz-selection.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    QuizSelectionComponent
  ],
  imports: [
    QuizSelectionRoutingModule,
    SharedModule
  ]
})
export class QuizSelectionModule { }
