import { Component } from '@angular/core';
import { AuthService } from '../../cors/service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history-challenge-data',
  imports: [CommonModule],
  templateUrl: './history-challenge-data.component.html',
  styleUrl: './history-challenge-data.component.css'
})
export class HistoryChallengeDataComponent {



  constructor(private authService:AuthService, private route:ActivatedRoute){}

  candidateId:any;
  ngOnInit():void{
    this.route.queryParamMap.subscribe(params => {
      this.candidateId = params.get('id');
      console.log("Received Session ID:", this.candidateId);
      // Use challengeId as needed
    });
    this.fetchChallenge();
  }


  challengeDetail:any;
  fetchChallenge(){
    console.log("Fetching");
    this.authService.getChallenge(this.candidateId).subscribe({next:(value:any)=>{
      console.log("Fetch the challenge Data",value)
      this.challengeDetail=value[0].challenges;
      console.log("Got the challenges here",this.challengeDetail);
    },
    error:(err)=>{
      console.log(err);
    }
  })

  }
}
