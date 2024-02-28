import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankserviceService } from '../bankservice.service';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';


@Component({
  selector:'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  fromUserId!: any;
  toUserId!: number;
  amount!: number;
  message!: string;
  errorMessage: string = ''; // For general errors
  insufficientBalanceError: string = ''; // For insufficient balance error
  transactionError: string = ''; // For other transaction-related errors
  userEmail!: string;
  userData: any;
  itemId!: any;
  itemDetails: any;
  data: any;
  storedUserEmail!:any
  datahis!:any
  id!:any
  idt!:any
  ACCOUNTNUMBER!:any;
  showModal = false; // Initialize showModal to false
  transamodal=true;
  modalMessage = ''; // Initialize modalMessage to an empty string
  
 
 

  constructor(private http: HttpClient,private service:BankserviceService,private router:Router,private bnIdle: BnNgIdleService,) {
    //transaction single user
   
  }
  ngOnInit(): void {
    this.bnIdle.startWatching(3000).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        console.log('session expired');
        this.router.navigate(['/login']);
        this.service.removeToken();
        this.service.canAccess(); 
      }
    });
   
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
    console.log("Stored User Email:", this.storedUserEmail);
    this.service.getDataById(this.storedUserEmail).subscribe((result) => {
      this.data = result;
      console.log("Data received from server:", this.data);
      // console.log("all data",this.data);
       this.fromUserId =this.data.ACCOUNTNUMBER
       
      console.log("your id", this.fromUserId);
      sessionStorage.setItem('idt',this.fromUserId)
    
      
      

    });
      this.idt=sessionStorage.getItem('idt')
      this.service.getDatatrans(this.idt).subscribe((result) => {
      this.datahis = result;
    });
 
   

    
  }



  transferMoney() {
    const transferData = {
      fromUserId: this.fromUserId,
      toUserId: this.toUserId,
      amount: this.amount,
      
    };

    this.http.post('http://localhost:3000/api/transfer', transferData).subscribe(

      (response: any) => {
        this.message = response.message;
        //display modal
         
        this.showModal = true;
        this.transamodal=false
        this.modalMessage = 'Money transfer was successful.';
         // Automatically close the modal and refresh the page after 2 seconds
         setTimeout(() => {
          this.closeModal(); // Close the modal
          window.location.reload();
        }, 6000); // 2000 milliseconds (2 seconds)
     
      
      },
      (error) => {
        
        if (error.status === 400 && error.error.message === 'Insufficient balance for transfer') {
          this.insufficientBalanceError = 'Insufficient balance for the transfer.';
        } else {
          this.transactionError = 'Error occurred during the transfer.';
          
        }
        
        this.transamodal=true;
        this.modalMessage = this.insufficientBalanceError || this.transactionError;
         
      
      }
    );
  }
  // close modal
  closeModal() {
    this.showModal = false;
    // Handle any actions after closing the modal (e.g., allowing the user to retry the transfer)
  }
  
// logut dashboard
  logout(){
    //remove token
    this.service.removeToken();
    this.service.canAccess();
    sessionStorage.clear();
}
refreshPage() {
  // Reload the current page
  window.location.reload();
}


  
}
