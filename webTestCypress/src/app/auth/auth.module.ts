import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  providers: [AuthService]
})
export class AuthModule { }
