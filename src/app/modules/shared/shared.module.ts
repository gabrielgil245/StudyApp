import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptComponent } from 'src/app/modules/shared/components/prompt/prompt.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PromptComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [PromptComponent]
})
export class SharedModule { }
