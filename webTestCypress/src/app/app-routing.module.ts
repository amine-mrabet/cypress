import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JsonEditorComponent } from './json-editor/json-editor.component';

const routes: Routes = [{
  path: '',
  component: JsonEditorComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
