import { NgModule } from '@angular/core';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ResultsComponent
  ],
  imports: [
    ResultsRoutingModule,
    SharedModule
  ]
})
export class ResultsModule { }
