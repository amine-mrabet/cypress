import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  form: FormGroup;
  serverErrors = [];

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],

    });
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }

  ngOnInit() {

  }
  onReset(): void {
    this.form.reset();
    this.authService.logout()
  }
  login(): void {
    this.authService.login(this.username!.value, this.password!.value).subscribe(
      (response: any) => {
        const token = response.token;
        // Validate the token
        this.authService.setToken(token);
        this.router.navigate(['/']);


      },
      (error: any) => {
        console.error('Login failed:', error);
      }
    );

  }

}
