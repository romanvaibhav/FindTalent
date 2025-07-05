export const CHALLENGE_URL = "http://localhost:4200/assesment";


import { FormGroup, FormControl, Validators } from '@angular/forms';

export const MY_FORM: FormGroup = new FormGroup({
  candidateName:new FormControl("",[Validators.required]),
  status:new FormControl("",),
  score:new FormControl(""),
  interviewerId: new FormControl(""),
  time_duration: new FormControl(""),
  submit:new FormControl(""),
});

