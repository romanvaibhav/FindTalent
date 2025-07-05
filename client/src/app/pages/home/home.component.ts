import { Component } from '@angular/core';
import { AuthService } from '../../cors/service/auth.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MY_FORM } from '../../constant/constant';

@Component({
  selector: 'app-home',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private authService:AuthService,private route:Router){}

  selectedEmployeeId:any;

  userid:any;
  ngOnInit():void{
    this.userid=localStorage.getItem("userId");
    console.log("USer ID",this.userid);
    this.sessionForm.get("interviewerId")?.setValue(this.userid);
    console.log(this.sessionForm.value);
    this.getSessionData();
  }

  sessionForm=MY_FORM


  currentPage = 1;
  pageLimit=10;
  searchText:any;
  sortBy:any
  sessionDate:any;
  getSessionData(){
    this.authService.getSession(this.currentPage, this.pageLimit, this.searchText, this.sortBy).subscribe({next:(value:any)=>{
      console.log("Got the Session Data Sceesfully",value);
      if (value.employees) {
        this.sessionDate = value.employees.filter((session:any) => session.submit === 'false');
      } else {
        console.error("Unexpected data structure:", value);
        this.sessionDate = []; // Set empty array to avoid errors
      }    },
    error:(err)=>{
      console.log("Got error while getting sessionData",err);
    }
  })
  }

  createSession(){
    this.authService.postSession(this.sessionForm.value).subscribe({next:(value:any)=>{
      console.log("Session Created",value);
      this.getSessionData();
      if (value) {
        const session=value
        this.sessionDate = session.filter((session:any) => session.submit === 'false');
      } else {
        console.error("Unexpected data structure:", value);
        this.sessionDate = []; // Set empty array to avoid errors
      }
      this.sessionForm.reset();
      this.closeModal();
      this.sessionForm.get("interviewerId")?.setValue(this.userid);

    },
    error:(err)=>{
      console.log("Got error while creating session",err);
    }
  })
  }


  sendBtn(){
    console.log(this.userid);
    console.log(this.sessionForm.value);
    this.authService.patchSession(this.sessionForm.value,this.selectedEmployeeId).subscribe({next:(value:any)=>{
      console.log("Got the values",value);
      if (value) {
        const session=value
        this.sessionDate = session.filter((session:any) => session.submit === 'false');      } else {
        console.error("Unexpected data structure:", value);
        this.sessionDate = []; // Set empty array to avoid errors
      }
      this.isUpdate=false;
      this.sessionForm.reset();
      this.sessionForm.get("interviewerId")?.setValue(this.userid);
    },
    error:(err)=>{
      console.log(err);
    }
  })
  }

  deleteBtn(){
    this.authService.deleteSessionById(this.selectedEmployeeId).subscribe({next:(value:any)=>{
      console.log("Emp Details Deleted Succesfulyy",value);
      if (value) {
        const session=value
        this.sessionDate = session.filter((session:any) => session.submit === 'false');
        console.log(this.sessionDate);
      } else {
        // console.error("Unexpected data structure:", value);
        this.sessionDate = []; // Set empty array to avoid errors
      }
      this.isUpdate=false;
      this.sessionForm.reset();
      this.sessionForm.get("interviewerId")?.setValue(this.userid);


    },
    error:(err)=>{
    console.log("Getting error while deleting the Emp Details",err);
    }})
  }


  isUpdate=false;
  isModalOpen=false;
  //Model
  openModal() {
    console.log("Hello")
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  isclose(){
    this.isUpdate=false;

  }
  selectSession:any;
  update(emp:any){
    console.log("hi");
    this.selectedEmployeeId=emp._id;
    this.selectSession=emp;
    console.log("Employe Id",this.selectedEmployeeId);
    this.isUpdate=true;
    this.sessionForm.get("interviewerId")?.setValue(this.userid);

    //Add to doc
    this.sessionForm.patchValue({
      candidateName:this.selectSession.candidateName || '',
      status:this.selectSession.status || '',
      score:this.selectSession.score || '',
      interviewerId:this.selectSession.interviewerId || '',
      time_duration:this.selectSession.time_duration || '',
      submit:this.selectSession.sessionForm || ''
    })
    console.log("Form values are",this.sessionForm.value);
  }


  navigate(Id: string) {
    this.route.navigate(["user/challenge"], { queryParams: { id: Id } });
    this.sessionForm.patchValue({
      status: 'In-Progress' // Set status to "In-Progress"{)
       });
    const sessionId=Id
    console.log("Form values which are patching are",this.sessionForm.value);
    this.authService.patchSession(this.sessionForm.value,sessionId).subscribe({next:(value)=>{
      console.log("Succesfull Patching values",value);
      this.sessionDate=value;
      this.isUpdate=false;
      this.sessionForm.reset();

    },
    error:(err)=>{
      console.log(err);
    }
  })
  }

}
