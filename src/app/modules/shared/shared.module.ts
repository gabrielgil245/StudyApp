import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptComponent } from 'src/app/modules/shared/components/prompt/prompt.component';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from './components/navigation/navigation.component';

@NgModule({
  declarations: [
    PromptComponent, 
    NavigationComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    PromptComponent, 
    NavigationComponent
  ]
})
export class SharedModule { }
