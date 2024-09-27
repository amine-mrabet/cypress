import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartModule} from 'primeng/chart'

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './chart/chart.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartModule
  ]
})
export class DashboardModule { }
