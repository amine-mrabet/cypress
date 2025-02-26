import { NgModule } from '@angular/core';

import { FeaturesRoutingModule } from './features-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { CustomJsonEditorComponent } from './json-editor/json-editor.component';
import { RunCypressComponent } from './run-cypress/run-cypress.component';
import { StatisticalDetailsComponent } from './statistical-details/statistical-details.component';
import { ScheduleJobComponent } from './schedule-job/schedule-job.component';


@NgModule({
  declarations: [CustomJsonEditorComponent, RunCypressComponent, StatisticalDetailsComponent,ScheduleJobComponent],
  imports: [
    CommonModule,
    SharedModule,
    FeaturesRoutingModule
  ]
})
export class FeaturesModule { }
