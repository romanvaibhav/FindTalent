import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';  // ✅ Import DatePipe
import { AuthService } from '../../cors/service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-hostory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],  // ✅ Add DatePipe here
  templateUrl: './hostory.component.html',
  styleUrl: './hostory.component.css'
})
export class HostoryComponent {
  constructor(
    private authService: AuthService,
    private datePipe: DatePipe,
    private route:Router  // ✅ Inject DatePipe here
  ) {}

  ngOnInit(): void {
    this.getSessionData();
  }
  pages:any;
  pageNumbers:any;
  currentPage = 1;
  pageLimit=10;
  searchText:any;
  sessionDate: any;
  sortBy:any='createdAt';
  pageArray:number[]=[5,10,15,20,25,30];

  getSessionData() {
    this.authService.getSession(this.currentPage, this.pageLimit, this.searchText, this.sortBy).subscribe({
      next: (value:any) => {
        console.log("Got the Session Data Successfully", value);
        this.pages=value.totalPages;
        console.log("Total Page",this.pages);
        this.pageNumbers = [];
        for (let i = 1; i <= this.pages; i++) {
            this.pageNumbers.push(i);
        }
        console.log("consoling",this.pageNumbers);
        if (value.employees) {
          this.sessionDate = value.employees
            .filter((session: any) => session.submit === 'true')
            .map((session: any) => ({
              ...session,
              formattedDate: this.datePipe.transform(session.createdAt, 'shortDate')
            }));
        } else {
          console.error("Unexpected data structure:", value);
          this.sessionDate = [];
        }
      },
      error: (err) => {
        console.error("Got error while getting sessionData", err);
      }
    });
  }

  applyFilters() {
    console.log("Search Text:", this.searchText, "Sort By:", this.sortBy);  // Debugging

    if (this.searchText || this.sortBy) {  // ✅ Only run if filters exist
      console.log("Applying Filters...");
      this.currentPage = 1;
      this.getSessionData();
    }
  }

  onPageLimitChange(event: any) {
    console.log("Event Target Value:", event.target.value);
    this.pageLimit = +event.target.value;
    console.log("Updated Page Limit:", this.pageLimit);
    this.currentPage = 1;
    this.getSessionData();
  }

  // currentPage = 1;
  // pageLimit=10;
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getSessionData();
    }
  }


  goToNextPage() {
    if (this.currentPage < this.pages) {
      this.currentPage++;
      this.getSessionData();
    }
  }


  goToPage(page: number) {
    this.currentPage = page;
    this.getSessionData();
  }

  navigate(Id: string) {
    this.route.navigate(["user/historyChallenge"], { queryParams: { id: Id } });
  }
}
