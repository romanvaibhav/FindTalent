import { Component } from '@angular/core';
import { AuthService } from '../../cors/service/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Clipboard } from '@angular/cdk/clipboard';
import { CHALLENGE_URL, MY_FORM } from '../../constant/constant';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketService } from '../../cors/socket/socket.service';


@Component({
  selector: 'app-challenge',
  imports: [CommonModule,ClipboardModule,ReactiveFormsModule,FormsModule],
  providers:[Clipboard],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.css'
})
export class ChallengeComponent {
  projectData:any;
  candidateId:any;
  isSidebarOpen:any=false;
  ProjectId:any;
  challengeDetail:any;
  challengeUrl=CHALLENGE_URL

  status: any;

  constructor(private socketService: SocketService ,private authService:AuthService, private route:ActivatedRoute, private clipboard: Clipboard, private router:Router){}
  ngOnInit():void{
    this.route.queryParamMap.subscribe(params => {
      this.candidateId = params.get('id');
      console.log("Received Session ID:", this.candidateId);
      // Use challengeId as needed
    });
    // this.socketService.currentStatus.subscribe((statusData) => {
    //   if (statusData) {
    //     this.status = statusData;
    //     console.log('Received status update:', statusData);
    //   }
    // });

    this.getProjData();
    this.fetchChallenge();
    this.socketService.currentStatus.subscribe((statusData: any) => {
      if (statusData) {
        console.log('Received statusData:', statusData);
        console.log('Current challengeDetail:', this.challengeDetail);  // Debugging line

        // Ensure both _id are being compared as strings
        const challenge = this.challengeDetail.find((ch: any) => String(ch._id) == String(statusData.projectId));

        if (challenge) {
          console.log('Found challenge:', challenge);
          challenge.status = statusData.status;
        } else {
          console.log('Challenge not found for _id:', statusData.projectId);
        }
      }
    });


    this.loadTimer();
    this.startTimer();

  }
  submitSession(){
  }
  currentPage=1;
  pageLimit=10;
  searchText:any;
  sortBy:any;
  getProjData(){
    this.authService.getProject(this.currentPage, this.pageLimit, this.searchText, this.sortBy).subscribe({next:(value:any)=>{
      console.log("Got the EmpData",value);
      this.projectData=value.employees;
      console.log("Here is empData",this.projectData);
    },
    error:(err:any)=>{
      console.log("Frontend error while fetching empData",err);
    }
  })
  }

  selectProject(project: any) {
    console.log("Here is project", project);
    this.isSidebarOpen = false;

    // Format the data correctly
    let challengeData = [{
      url: project.StackBlitzUrl,  // Sending the URL
      title: project.title         // Sending the Title
    }];
    // Call postChallenge with the formatted data
    this.authService.postChallenge(challengeData, project.userId, this.candidateId)
      .subscribe({
        next: (value: any) => {
          console.log("Posted the challenge Data", value);
          this.challengeDetail=value.challenges;
          console.log("challenges",this.challengeDetail);
        },
        error: (err) => {
          console.error("Error posting challenge data", err);
        }
      });
  }

  fetchChallenge(){
    console.log("Fetching");
    this.authService.getChallenge(this.candidateId).subscribe({next:(value:any)=>{
      console.log("Fetch the challenge Data",value)
      this.challengeDetail=value[0]?.challenges;
      console.log("Got the challenges here",this.challengeDetail);
    },
    error:(err)=>{
      console.log(err);
    }
  })

  }

  deleteChallenge(id:any){
    console.log("Deleting challenge od ID",id);
    this.authService.deleteChallenge(id,this.candidateId).subscribe({next:(value:any)=>{
      console.log("value after Deleting",value);
      this.fetchChallenge();
    },
    error:(err)=>{
      console.log(err);
    }
  })
  }

  Score:any;
  submitChallenge(challengeId:any){
    console.log("Got the challenge id here",challengeId);
    console.log(this.Score);
    const status="Completed";
    const snapshot: File | null = null;
    this.authService.patchChallenge(challengeId,status,this.Score,snapshot).subscribe({next:(value:any)=>{
      console.log("Succesfully patched the values",value);
    },
    error:(err)=>{
      console.log("Got the error at the patching challenge values",err);
    }
  })

  }

  copyToClipboard(url:any){
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  sessionForm=MY_FORM;
  Status:any;
  Time:any;
  createSession(){
    this.sessionForm.get("score")?.setValue(this.Score);
    this.sessionForm.get("status")?.setValue(this.Status);
    this.sessionForm.get("time_duration")?.setValue(this.Time);
    this.sessionForm.get("submit")?.setValue("true");
    console.log(this.Score,this.Status,this.Time);
    console.log(this.sessionForm.value);
    this.authService.patchSession(this.sessionForm.value,this.candidateId).subscribe({next:(value)=>{
      console.log("Got the values",value);
      // this.sessionDate=value;
      this.isModalOpen = false;
      localStorage.removeItem('timeElapsed');
      this.displayedTime = "00:00"; // Reset displayed time
      this.timeElapsed = 0;
      clearInterval(this.timerInterval);
      this.router.navigateByUrl("/user/home");

      this.sessionForm.reset();
      // this.sessionForm.get("interviewerId")?.setValue(this.userid);

    },
    error:(err)=>{
      console.log(err);
    }
  })
  }

  isModalOpen=false;

  displayedTime:any;
  openModal() {
    console.log("Hello")
    this.isModalOpen = true;
    // this.pauseTimer();
    this.displayedTime = this.getFormattedTime();
    this.Time=this.displayedTime;
    this.getFormattedTime();
  }

  closeModal() {
    this.isModalOpen = false;
    this.startTimer();
  }

  timeElapsed: number = 0;
  timerInterval: any;
  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.timeElapsed++;
      localStorage.setItem('timeElapsed', this.timeElapsed.toString());
    }, 1000);
  }

  loadTimer() {
    const storedTime = localStorage.getItem('timeElapsed');
    if (storedTime !== null) {
      this.timeElapsed = parseInt(storedTime, 10);
    }
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeElapsed / 60);
    const seconds = this.timeElapsed % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  pauseTimer() {
    clearInterval(this.timerInterval);
    localStorage.setItem('timeElapsed', this.timeElapsed.toString());
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.timeElapsed = 0;
    localStorage.removeItem('timeElapsed');
  }


  ScoringChallenge(challengeId: number) {
    // Logic to handle challenge submission
    console.log('Challenge submitted:', challengeId);
  }
  updateScore(challengeId: number, newScore: string) {

      this.Score = newScore;
      // this.socketService.emitStatusUpdated(challenge);

  }

}
