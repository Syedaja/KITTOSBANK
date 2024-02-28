import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankserviceService } from '../bankservice.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  errorMessage: string = ''; // To display an error message
  errmsg: string=''
    constructor(
      private authService: BankserviceService, // Replace with the actual name of your authentication service.
      private formBuilder: FormBuilder,
      private router: Router 
    ) {
      this.registrationForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        account_number:['',Validators.required],
        age:['',Validators.required],
        adhar_number:['',Validators.required]
      });
    }
  ngOnInit(): void {
    this.authService.canAuthenticate();
  }
  
    onSubmit() {
      if (this.registrationForm.valid) {
        const { name, email, password,} = this.registrationForm.value;
        this.authService.register(name, email, password).subscribe(
          response => {
         
          },
          error => {
            if (error.error.error.message === 'EMAIL_EXISTS') {
              this.errorMessage = 'Email is already registered.';
            } else {
              this.errorMessage = 'Registration failed. Please try again.';
            }
           
          }
        );
      }
    }
    //create new user
    userSubmit() {
    if (this.registrationForm.valid) {
      // Call the service to register the user
      this.authService.registerUser(this.registrationForm.value).subscribe(
        (response) => {
          console.log(response); // You can handle the response here
          // Optionally, navigate to a success page or perform other actions
        },
        (error) => {
          console.error(error); // Handle errors
        }
      );
    }
  }
  
}
