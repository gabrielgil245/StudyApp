import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptComponent } from 'src/app/modules/shared/components/prompt/prompt.component';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ModalComponent } from './components/modal/modal.component';
import { ScrollBackToTopComponent } from './components/scroll-back-to-top/scroll-back-to-top.component';

@NgModule({
  declarations: [
    PromptComponent, 
    NavigationComponent, 
    ModalComponent, 
    ScrollBackToTopComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    PromptComponent, 
    NavigationComponent,
    ModalComponent,
    ScrollBackToTopComponent
  ]
})
export class SharedModule { }
