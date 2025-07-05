import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { Component } from '@angular/core';
import { RegistrationComponent } from './modules/registration/registration.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { AssesmentPageComponent } from './pages/assesment-page/assesment-page.component';
import { ChallengeComponent } from './pages/challenge/challenge.component';
import { CompletedComponent } from './pages/completed/completed.component';
import { ExpiredComponent } from './pages/expired/expired.component';
import { HostoryComponent } from './pages/hostory/hostory.component';
import { HistoryChallengeDataComponent } from './pages/history-challenge-data/history-challenge-data.component';

export const routes: Routes = [
  {
    path:"",
    component:LoginComponent
  },
  // {
  //   path:"regi",
  //   component:RegistrationComponent
  // },
  // {
  //   path:"home",
  //   component:HomeComponent
  // },
  // {
  //   path:"project",
  //   component:ProjectsComponent
  // },
  {
    path: "user",
    children: [
      {path:"home", component:HomeComponent},
      {
        path:"project",
        component:ProjectsComponent
      },
      {
        path:"challenge",
        component:ChallengeComponent
      },
      {
        path:"history",
        component:HostoryComponent
      },{
        path:"historyChallenge",
        component:HistoryChallengeDataComponent
      }
    ]
  },
  {
    path: 'assesment',
    component: AssesmentPageComponent,
  },
  { path: "regi", component: RegistrationComponent },
  {
    path:"assesment/completed",
    component:CompletedComponent
  },
  {
    path:"assesment/expired",
    component:ExpiredComponent
  }

];
