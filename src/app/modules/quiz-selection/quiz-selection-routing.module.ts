import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizSelectionComponent } from './quiz-selection.component';

const routes: Routes = [
  {path: '', component: QuizSelectionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizSelectionRoutingModule { }
