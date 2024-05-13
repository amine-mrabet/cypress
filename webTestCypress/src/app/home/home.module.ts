import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '@app/shared/shared.module';
import { LayoutsModule } from '@app/layouts/layouts.module';
import { requestInterceptorProvider } from '@app/shared/services/request-interceptor.service';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    LayoutsModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    requestInterceptorProvider
  ]
})
export class HomeModule { }
