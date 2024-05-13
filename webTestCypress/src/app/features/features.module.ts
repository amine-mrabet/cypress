import { NgModule } from '@angular/core';

import { FeaturesRoutingModule } from './features-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { CustomJsonEditorComponent } from './json-editor/json-editor.component';
import { RunCypressComponent } from './run-cypress/run-cypress.component';


@NgModule({
  declarations: [CustomJsonEditorComponent, RunCypressComponent],
  imports: [
    CommonModule,
    SharedModule,
    FeaturesRoutingModule
  ]
})
export class FeaturesModule { }
