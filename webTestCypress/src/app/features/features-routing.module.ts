import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomJsonEditorComponent } from './json-editor/json-editor.component';
import { RunCypressComponent } from './run-cypress/run-cypress.component';


const routes: Routes = [
  {
    path: 'editor/:param1/:param2',
    component: CustomJsonEditorComponent,
  },
  {
    path: 'editor',
    component: CustomJsonEditorComponent,
  },
  {
    path: 'runCypress',
    component: RunCypressComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
