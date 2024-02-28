import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankserviceService } from '../bankservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-successfull',
  templateUrl: './register-successfull.component.html',
  styleUrls: ['./register-successfull.component.css']
})
export class RegisterSuccessfullComponent implements OnInit {
  fromUserId!: any;
  userEmail!: string;
  data: any;
  storedUserEmail!:any
  datahis!:any
  id!:any
  idt!:any
  constructor(private http: HttpClient,private service:BankserviceService,private router:Router) {}
  ngOnInit(): void {
    // Call the loadData function when the component initializes spinner
     this.loadData();
    this.service.canAccess();
    // Fetch user-specific data based on the email
    this.userEmail = this.service.getUserEmail();
     // Check if the user email is not null or undefined before storing it
     if (this.userEmail) {
       sessionStorage.setItem('userEmail', this.userEmail);
       console.log('User email stored in session storage:', this.userEmail);
     } else {
       console.log('User email is null or undefined, not stored in session storage.');
     }
 
    console.log("User Email:", this.userEmail);
 
   // this.service.getUserDataByEmail(this.userEmail).subscribe((data) => {
   //   this.userData = data;
 
   //   // Log the data here
   //   console.log("User data:", this.userData);
   // });
   
     // Replace '1' with the desired MySQL ID
     this.storedUserEmail = sessionStorage.getItem('userEmail');
     this.service.getDataById(this.storedUserEmail).subscribe((result) => {
       this.data = result;
       // console.log("all data",this.data);
        this.fromUserId =this.data.id
        
       console.log("your id", this.fromUserId);
       sessionStorage.setItem('idt',this.fromUserId)
     
       
       
 
     });
       this.idt=sessionStorage.getItem('idt')
       this.service.getDatatrans(this.idt).subscribe((result) => {
       this.datahis = result;
     });
     
  
 
     
 
  }
  loading: boolean = true;

  // Simulate data loading, you would replace this with your actual data fetching logic
  loadData() {
    setTimeout(() => {
      this.loading = false;
      // Show the modal programmatically without trigger
      this.showModal();
    }, 2000); // Simulating a 2-second delay
  }
  showModal(){
    // Programmatically open the modal
    const modalTrigger = document.getElementById('modalTrigger');
    if (modalTrigger) {
      modalTrigger.click();
    }
  }
  navigate(){
    this.router.navigate(['/'])
    this.service.removeToken();
    this.service.canAccess(); 
  }
}


