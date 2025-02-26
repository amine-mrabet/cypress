import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomJsonEditorComponent } from './json-editor/json-editor.component';
import { RunCypressComponent } from './run-cypress/run-cypress.component';
import { StatisticalDetailsComponent } from './statistical-details/statistical-details.component';
import { ScheduleJobComponent } from './schedule-job/schedule-job.component';


const routes: Routes = [
  { path: '', loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule) },
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
  },
  {
    path: 'statistical-details',
    component: StatisticalDetailsComponent,
  },
  {
    path: 'schedule-job',
    component: ScheduleJobComponent,
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
