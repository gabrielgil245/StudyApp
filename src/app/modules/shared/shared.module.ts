import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptComponent } from 'src/app/modules/shared/components/prompt/prompt.component';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ModalComponent } from './components/modal/modal.component';
import { ScrollBackToTopComponent } from './components/scroll-back-to-top/scroll-back-to-top.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { AccordionComponent } from './components/accordion/accordion.component';

@NgModule({
  declarations: [
    PromptComponent, 
    NavigationComponent, 
    ModalComponent, 
    ScrollBackToTopComponent, 
    TruncatePipe, 
    AccordionComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FormsModule,
    PromptComponent, 
    NavigationComponent,
    ModalComponent,
    ScrollBackToTopComponent,
    TruncatePipe,
    AccordionComponent
  ]
})
export class SharedModule { }
