import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../cors/service/auth.service';
import { LoginComponent } from '../../modules/login/login.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';  // Add this import
import { MatInputModule } from '@angular/material/input';  // Add this import
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-projects',
  imports: [CommonModule,FormsModule, ReactiveFormsModule, RouterLink,MatAutocompleteModule, MatInputModule, MatButtonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  roles: string[] | undefined;

  constructor(private cdr: ChangeDetectorRef,private router: ActivatedRoute, private authService:AuthService, private route:Router){
    this.techForm = new FormGroup({
      customTechnology: new FormControl('')
    });
  }
  selectedEmployeeId: any = null;
  selectedEmpId:any;

  pages:any;
  pageNumbers:number[]=[];
  currentPage = 1;
  pageLimit=10;
  searchText:any;
  sessionDate: any;
  sortBy:any='createdAt';
  pageArray:number[]=[5,10,15,20,25,30];
  sortOrder: string = 'asc';
  projectData:any;
  isModalOpen = false;
  isUpdate=false;

  userid:any;
  projectId:any;

  ngOnInit(){
    this.roles=[
      "React.js",
      "Angular.js",
      "Javascript",
      "Typescript",
      "Node.js",
    ];
    this.userid=localStorage.getItem("userId");
    console.log("USer ID",this.userid);
    this.projForm.get("userId")?.setValue(this.userid);

    // const org_id=this.router.snapshot.queryParams['id'];
    // console.log(org_id);
    // this.projForm.get("Org_id")?.setValue(org_id);
    console.log(this.projForm.value);
    this.getProjData();
  }

  openModal() {
    console.log("Hello")
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.selectedTechnologies=[]

  }

  isclose(){
    this.isUpdate=false;
    this.projForm.reset();
    this.selectedTechnologies=[]

  }

  isupdate(proj:any){
    this.selectedEmployeeId=proj;
    this.projectId=proj._id;
    console.log(this.projectId);
    console.log(this.selectedEmployeeId);
    this.selectedTechnologies=proj.skills;
    console.log("Printing skills",this.selectedTechnologies);
    this.isUpdate=true;
    this.projForm.patchValue({
      title:this.selectedEmployeeId.title || '',
      skills:this.selectedEmployeeId.skills || '',
      StackBlitzUrl:this.selectedEmployeeId.StackBlitzUrl || '',
      userId:this.selectedEmployeeId.userId || '',
    })
    console.log("Form values are",this.projForm.value);
  }



  projForm:FormGroup=new FormGroup({
    title:new FormControl("",[Validators.required]),
    skills:new FormControl([],[Validators.required]),
    StackBlitzUrl:new FormControl("",[Validators.required]),
    userId: new FormControl("")
  })

  projBtn(){
    console.log(this.userid);
    console.log(this.projForm.value);
    this.authService.postProject(this.projForm.value).subscribe({next:(value)=>{
      console.log("Got the values",value);
      this.projectData=value;
      this.getProjData();
      this.isModalOpen = false;
      this.projForm.reset();
      this.projForm.get("userId")?.setValue(this.userid);
    },
    error:(err)=>{
      console.log(err);
    }
  })
  }

  sendBtn(){
    console.log(this.userid);
    console.log(this.projForm.value);
    this.authService.patchProject(this.projForm.value,this.projectId).subscribe({next:(value)=>{
      console.log("Got the values",value);
      this.projectData=value;
      this.isUpdate=false;
      this.projForm.reset();
      this.getProjData();
    },
    error:(err)=>{
      console.log(err);
    }
  })
  }

  get skillsArray() {
    return this.projForm.get("skills") as FormArray;
  }

  onSelectChange(event: Event) {
    const selectedOptions = (event.target as HTMLSelectElement).selectedOptions;
    const values = Array.from(selectedOptions).map(option => option.value);

    this.projForm.get("skills")?.setValue(values); // Store selected skills
  }

  deleteBtn(){
    const id=this.selectedEmployeeId!._id;
    console.log("Hello");
    this.authService.deleteProjById(id).subscribe({next:(value)=>{
      console.log("Emp Details Deleted Succesfulyy",value);
      this.getProjData();
      this.isUpdate=false;
    },
    error:(err)=>{
    console.log("Getting error while deleting the Emp Details",err);
    }})
    }

  getProjData(){
    console.log("Printing PageLimit",this.pageLimit);
    this.authService.getProject(this.currentPage, this.pageLimit, this.searchText, this.sortBy).subscribe({next:(value:any)=>{
      console.log("Got the EmpData",value);
      this.projectData=value;
      console.log("Here is empData",this.projectData);
      // this.pageLimit=this.projectData.totalEmployees;
      this.pages=this.projectData.totalPages;
      console.log("Total Page",this.pages);
      this.pageNumbers = [];
      this.selectedTechnologies=[]
      this.projForm.get('skills')?.setValue('');
      for (let i = 1; i <= this.pages; i++) {
          this.pageNumbers.push(i);
      }
      console.log("consoling",this.pageNumbers);
    },
    error:(err)=>{
      console.log("Frontend error while fetching empData",err);
    }
  })
  }



  applyFilters() {
    console.log("Search Text:", this.searchText, "Sort By:", this.sortBy);  // Debugging
    if (this.searchText || this.sortBy) {  // ✅ Only run if filters exist
      console.log("Applying Filters...");
      this.currentPage = 1;
      this.getProjData();
    }
  }

  // logoutBtn(){
  //   this.authService.logout().subscribe({next:(value:any)=>{
  //     localStorage.removeItem('accessToken');
  //     this.route.navigateByUrl("/");

  //   }})
  // }

  technologies: string[] = ['Angular', 'React', 'Vue', 'Node', 'JavaScript', 'Python', 'Java'];

  techForm: FormGroup;

  selectedTechnologies: string[] = [];

  // Filtered suggestions based on input
  filteredTechnologies: string[] = [];

  // Boolean to check if a custom technology should be added
  isNewTechnology: boolean = false;
  // Toggle selection when checkbox is clicked
  onInputChange() {
    const query = this.techForm.get('customTechnology')?.value.toLowerCase();

    // Filter technologies based on the input query
    this.filteredTechnologies = this.technologies.filter(tech =>
      tech.toLowerCase().includes(query)
    );

    // If no suggestion matches, show "Add new technology"
    this.isNewTechnology = !this.filteredTechnologies.some(tech => tech.toLowerCase() === query);
  }

  // This function is triggered when a suggestion is selected
  onTechnologySelected(event: any) {
    this.addTechnology(event.option.value);
  }

  // Add technology to the selected list
  addTechnology(tech: string) {
    if (!this.selectedTechnologies.includes(tech)) {
      this.selectedTechnologies.push(tech);
    }

    // Update the skills field of projForm with the selected technologies
    this.projForm.get('skills')?.setValue(this.selectedTechnologies);

    // Clear the tech input and reset suggestions
    this.techForm.get('customTechnology')?.setValue('');
    this.filteredTechnologies = [];
    this.isNewTechnology = false;
  }

  // Add custom technology if it's not in the list
  addCustomTechnology() {
    // const newTech = this.techForm.get('customTechnology')?.value;
    // console.log("Value is ",);
    // console.log("New Technology to add: ", newTech);
    // if (newTech && !this.selectedTechnologies.includes(newTech)) {
    //   this.selectedTechnologies.push(newTech);
    //   this.technologies.push(newTech); // Optionally, add it to the available list of technologies
    // }

    // this.techForm.get('customTechnology')?.setValue("HIIIIIIIIIIIIIIIII");
    // Update the skills field of projForm with the selected technologies
    // this.projForm.get('skills')?.setValue(this.selectedTechnologies);

    // Clear the tech input and reset suggestions
    // this.techForm.get('customTechnology')?.setValue('');
    // this.filteredTechnologies = [];
    // this.isNewTechnology = false;
  }


  // Remove technology from the selected list
  removeTechnology(tech: string) {
    this.selectedTechnologies = this.selectedTechnologies.filter(t => t !== tech);
    // if (!this.selectedTechnologies.includes(tech)) {
    //   this.selectedTechnologies.push(tech);
    // }

    // Update the skills field of projForm with the selected technologies
    this.projForm.get('skills')?.setValue(this.selectedTechnologies);

  }



  //Pagination

  onPageLimitChange(event: any) {
    console.log("Event Target Value:", event.target.value);
    this.pageLimit = +event.target.value;
    console.log("Updated Page Limit:", this.pageLimit);
    this.currentPage = 1;
    this.getProjData();
  }

  // currentPage = 1;
  // pageLimit=10;
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getProjData();
    }
  }


  goToNextPage() {
    if (this.currentPage < this.pages) {
      this.currentPage++;
      this.getProjData();
    }
  }


  goToPage(page: number) {
    this.currentPage = page;
    this.getProjData();
  }
}

