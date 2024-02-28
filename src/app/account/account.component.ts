import { Component, OnInit } from '@angular/core';
import { BankserviceService } from '../bankservice.service';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MyModalComponent } from '../my-modal/my-modal.component';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit{
  //modal  start
  bsModalRef!: BsModalRef;
  ///modal end
  userId!: number;
  amount!: number;
  transactionType!: string;
  historyUserId!: number;
  bankservice: any;
  // email get single user display
  userEmail!: string;
  userData: any;
  registrationForm: any;
  data: any[] = [];
  datatransaction:any[]=[];
  // filteredData: any[] = [];
  searchQuery = '';
 
  
  
  
  constructor(private transactionService: BankserviceService,private http: HttpClient,private formBuilder: FormBuilder,private bnIdle: BnNgIdleService, private auth:AdminService,private router:Router, private modalService: BsModalService) {
    
  }
  ngOnInit(): void {
    this.getAllData();
    this.getAllDatatransaction();
    this.auth.canAccess();
    this.bnIdle.startWatching(1000000).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        console.log('session expired');
        this.router.navigate(['/adminlogin']);
        // this.auth.removeToken();
        // this.auth.canAccess(); 
        this.logout();
      }
    });
  
    // this.bankservice.canAccess();
     

     // Fetch user data based on email
     // Get the user email from the shared service
       // Set the user's email (example)
      //  this.transactionService.setUserEmail('syedraja@gmail.com');

       // Retrieve the user's email
       this.userEmail = this.transactionService.getUserEmail();
   
       if (this.userEmail) {
         console.log('User Email:', this.userEmail);
       } else {
         console.log('User Email is not set.');
       }
      //  form
      this.registrationForm = this.formBuilder.group({
        acnum:['', [Validators.required,Validators.pattern(/^12345\d{10}$/)]],
        amount:['', [Validators.required,Validators.pattern(/^[1-9]\d*$/),this.depositAmountValidator()]],
        type:['', [Validators.required]],
        
      });
      // Subscribe to 'type' changes to trigger revalidation of 'amount'
  this.registrationForm.get('type')?.valueChanges.subscribe(() => {
    this.registrationForm.get('amount')?.updateValueAndValidity();
  });

  }

  

  depositOrWithdraw() {
    // ...

    if (this.transactionType === 'deposit') {
      this.transactionService.deposit(this.userId, this.amount).subscribe((response) => {
        // Open the modal with custom content
        this.openModal(this.userId, 'Deposit', this.amount);
      });
    } else if (this.transactionType === 'debit') {
      this.transactionService.withdraw(this.userId, this.amount).subscribe((response) => {
        // Open the modal with custom content
        this.openModal(this.userId, 'Debit', this.amount);
      });
    }
  
    if (this.registrationForm.valid) {
      // Handle form submission here
      console.log('Form submitted:', this.registrationForm.value);
    }
  }

  openModal(accountNumber: number, transactionType: string, amount: number) {
    const initialState = {
      accountNumber: accountNumber,
      transactionType: transactionType,
      amount: amount,
    };
    this.bsModalRef = this.modalService.show(MyModalComponent, { initialState });
  }
  
  getTransactionHistory(userId: number): void {
    this.transactionService.getTransactionHistory(userId).subscribe(
      (response) => {
        // Handle success
        console.log(response);
      },
      (error) => {
        // Handle error
        console.error(error);
      }
    );
  }
 
// validation
isInvalid(fieldName: string): boolean {
  const control = this.registrationForm.get(fieldName);
  return control ? (control.touched && control.invalid) : false;
}

isValid(fieldName: string): boolean {
  const control = this.registrationForm.get(fieldName);
  return control ? (control.touched && control.valid) : false;
}

validateField(fieldName: string) {
  const control = this.registrationForm.get(fieldName);
  if (control) {
    if (control.invalid) {
      control.markAsTouched();
    }
  }
}

// get all data
getAllData(): void {
  this.transactionService.getAllData()
    .subscribe(data => {
      this.data = data;
    });
}
// get all transaction
getAllDatatransaction(): void {
  this.transactionService.getAllDatatransaction()
    .subscribe(data => {
      this.datatransaction = data;
    });
}






// firebase authenticate logout
logout(){
  //remove token
  this.auth.removeToken();
  this.auth.canAccess();
}

// above 49000 validation error 
depositAmountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const amount = control.value;
    const transactionType = control.parent?.get('type')?.value;

    if (transactionType === 'deposit' && amount && amount > 49000) {
      return { 'amountExceeded': true };
    }

    return null;
  };
}
} 
