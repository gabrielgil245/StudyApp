import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'quiz-selection', pathMatch: 'full'},
  {path: 'quiz-selection', loadChildren: () => import('./modules/quiz-selection/quiz-selection.module').then(m => m.QuizSelectionModule)},
  {path: 'quiz', loadChildren: () => import('./modules/quiz/quiz.module').then(m => m.QuizModule)},
  {path: 'results', loadChildren: () => import('./modules/results/results.module').then(m => m.ResultsModule)},
  {path: '**', redirectTo: 'quiz-selection'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
