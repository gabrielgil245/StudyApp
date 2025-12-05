import { NgModule } from '@angular/core';

import { QuizRoutingModule } from './quiz-routing.module';
import { QuizComponent } from './quiz.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    QuizComponent
  ],
  imports: [
    QuizRoutingModule,
    SharedModule
  ]
})
export class QuizModule { }
