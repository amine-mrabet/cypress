import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import { JsonEditorService } from './services/json-editor.service';
import { HttpClientModule } from '@angular/common/http';
import { MenuModule } from 'primeng/menu';

@NgModule({
  declarations: [
    AppComponent,
    JsonEditorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MenuModule
  ],
  providers: [JsonEditorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
