import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from './components/loader/loader.component';
import { PlmTemplateDirective } from './directives/plm-template.directive';
import { LoaderService } from './services/loader.service';
import { RequestInterceptorService } from './services/request-interceptor.service';
import {ButtonModule} from 'primeng/button';
import { NgJsonEditorModule } from 'ang-jsoneditor' 
import { AccordionModule } from 'primeng/accordion';
@NgModule({
  declarations: [
    LoaderComponent,
    PlmTemplateDirective
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    HttpClientModule,
    CommonModule,
    SidebarModule,
    PanelMenuModule,
    DropdownModule,
    ButtonModule,
    NgJsonEditorModule,
    AccordionModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    HttpClientModule,
    LoaderComponent,
    PlmTemplateDirective,
    SidebarModule,
    PanelMenuModule,
    DropdownModule,
    ButtonModule,
    NgJsonEditorModule,
    AccordionModule
  ],
  providers: [LoaderService, MessageService,RequestInterceptorService]
})
export class SharedModule { }
