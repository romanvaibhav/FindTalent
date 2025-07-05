import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../cors/service/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  constructor(private authService:AuthService){}
  regiForm:FormGroup=new FormGroup({
    email:new FormControl("",[Validators.required, Validators.email]),
    password:new FormControl("",[Validators.required, Validators.minLength(8)]),
  });
  adminRegistration(){
  if (this.regiForm.valid) {
    console.log('Form Submitted:', this.regiForm.value);
    this.authService.postRegistration(this.regiForm.value).subscribe({next:(value)=>{
      console.log("Succesfully registered",value);
    },
    error:(err)=>{
      console.log("Getting error at registration",err);
    }
  })
  } else {
    console.log('Form is Invalid');
  }

  }
}
