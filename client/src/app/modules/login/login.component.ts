import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../cors/service/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private route: Router, private authService: AuthService) {}
  static user_id:any;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  loginBtn() {
    if (this.loginForm.invalid) {
      console.log('Email and password both are required');
    } else {
      console.log('clicked on login btn');
      console.log(this.loginForm.value);
      this.authService.postLogin(this.loginForm.value).subscribe({
        next: (value: any) => {
          console.log('Succsfully login to the account', value._id);
          LoginComponent.user_id=value._id;
          localStorage.setItem("userId",value._id);
          console.log(LoginComponent.user_id);

          // this.route.navigate(['/home'], { queryParams: { id: value._id } });
          this.route.navigateByUrl('user/home');
        },
        error: (err: any) => {
          console.log('Got Error while doing frontend login', err);
        },
      });
    }
  }
}
