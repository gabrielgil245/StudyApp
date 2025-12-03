import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptComponent } from 'src/app/components/prompt/prompt.component';



@NgModule({
  declarations: [PromptComponent],
  imports: [
    CommonModule
  ],
  exports: [PromptComponent]
})
export class SharedModule { }
