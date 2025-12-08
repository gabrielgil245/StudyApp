import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptComponent } from 'src/app/modules/shared/components/prompt/prompt.component';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    PromptComponent, 
    NavigationComponent, 
    ModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    PromptComponent, 
    NavigationComponent,
    ModalComponent
  ]
})
export class SharedModule { }
