import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankserviceService } from '../bankservice.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-account-open',
  templateUrl: './account-open.component.html',
  styleUrls: ['./account-open.component.css']
})
export class AccountOpenComponent implements OnInit {
  registrationForm!: FormGroup;
  errorMessage:string =""
  loading: boolean = false;


  constructor(private formBuilder: FormBuilder,private authService:BankserviceService,private router:Router) { }
   
  ngOnInit() {
   
      // Load the generated number from localStorage when the component initializes - Account Number
      const storedNumber = localStorage.getItem('NewAccountNumber');
      this.generatedNumber = storedNumber ? parseInt(storedNumber, 10) : 0;
      // End of  the storing ACC 
  
    
    
    
    this.registrationForm = this.formBuilder.group({
       // 1.Name Validation
       name:['', [Validators.required, Validators.pattern(/^[a-zA-Z\s']+$/u)]],
       // ^: Asserts the start of the string.
       // [a-zA-Z]: Matches any uppercase or lowercase letter.
       // \s: Matches any whitespace character (including space, tab, and newline).
       // '+: Allows an apostrophe in the name.
       // $: Asserts the end of the string.
       // u: Enables Unicode matching (useful for names with non-ASCII characters).
       
       // 2.Email Validation
       email:['', [Validators.required,  Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
       // ^: Asserts the beginning of the string.
       // [\w-]+:
       // [\w-]: Matches any word character (alphanumeric or underscore) or hyphen.
       // +: Requires one or more occurrences of the preceding pattern.
       // This part ensures that the string starts with one or more word characters or hyphens.
       // (\.[\w-]+)*:
       // (\.[\w-]+): This is a group that matches a dot (.) followed by one or more word characters or hyphens.
       // *: Allows for zero or more occurrences of the entire group. This part allows for the presence of periods and additional characters (like subdomains) after the initial word character or hyphen.
       // @: Matches the at symbol (@) literally.
       // ([\w-]+\.)+:
       // ([\w-]+\.): Another group that matches one or more word characters or hyphens followed by a dot.
       // +: Requires one or more occurrences of the entire group. This part allows for the presence of subdomains separated by dots.
       // [a-zA-Z]{2,7}:
       // [a-zA-Z]: Matches any uppercase or lowercase letter.
       // {2,7}: Requires between 2 and 7 occurrences of the preceding pattern. This part ensures that the domain has between 2 and 7 letters.
       // $: Asserts the end of the string.
       
       // 3.Password
       password:['', [Validators.required,Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8}$/)]],
       // At least one upper case English letter, (?=.*?[A-Z])
       // At least one lower case English letter, (?=.*?[a-z])
       // At least one digit, (?=.*?[0-9])
       // At least one special character, (?=.*?[#?!@$%^&*-])
       // Minimum eight in length .{8,} (with the anchors)
 
       // 4.confirmpassword
       confirmpassword:['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8}$/)
       ]],
       // At least one upper case English letter, (?=.*?[A-Z])
       // At least one lower case English letter, (?=.*?[a-z])
       // At least one digit, (?=.*?[0-9])
       // At least one special character, (?=.*?[#?!@$%^&*-])
       // Minimum eight in length .{8,} (with the anchors)
 
       fathersname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s']+$/u)]],
       adhar_number: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],

       education: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s']+$/u)]],
       
       city: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s']+$/u)]],
       
       state: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s']+$/u)]],
       
       age: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/),(control: FormGroup): { [key: string]: boolean } | null => {
        const age = control.value;
        // Check if age is below 17
        if (age !== null && age !== undefined && age >= 17) {
          return { 'below17': true }; // Return an error if age is 17 or above
        }
        return null; // No error, age is below 17
      }]],
       
       mobilenumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
       
       balance: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
       generatedNumber:[''],
      
    }, {
      validator: this.passwordMatchValidator
    });
    // restrict the back button of Regsiter success pages
    this.authService.RegistercanAuthenticate();
    
  }
  
passwordMatchValidator(group: FormGroup): any {
  const passwordControl = group.get('password');
  const confirmPasswordControl = group.get('confirmpassword'); // change 'confirmPassword' to 'confirmpassword'

  if (passwordControl && confirmPasswordControl) {
    const password = passwordControl.value;
    const confirmpassword = confirmPasswordControl.value;

    return password === confirmpassword ? null : { mismatch: true };
  }

  // Return null if controls are not null (to satisfy the return type), but they shouldn't be null.
  return null;
}

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
  submitForm() {
    if (this.registrationForm.valid) {
      // Handle form submission here
      console.log('Form submitted:', this.registrationForm.value);
    }
  }
  onSubmit() {
    if (this.registrationForm.valid) {
      this.loading = true;
      const { name, email, password,} = this.registrationForm.value;
      this.authService
      .register(name,email,password)
      .subscribe({
          next:data=>{
              //store token from response data
              this.authService.storeToken(data.idToken);
              console.log('Registered idtoken is '+data.idToken);
               // Set the user email for use in the dashboard
          this.authService.setUserEmail(email);
           // Navigate to the dashboard
              this.authService.RegistercanAuthenticate();
              this.generateAndStoreAccountNumber();
               
         

          },
          error:data=>{
              if (data.error.error.message=="INVALID_EMAIL") {

                  this.errorMessage = "Invalid Email!";

              } else if (data.error.error.message=="EMAIL_EXISTS") {

                  this.errorMessage = "Already Email Exists!";

              }else{

                  this.errorMessage = "Unknown error occured when creating this account!";
              }
          }
      }).add(()=>{
          this.loading =false;
          console.log('Register process completed!');
      })
    }
  }
  //create new user
  //  Random Acc Number
  generatedNumber: number = 0;
  ACCOUNTNUMBER:number = 0;
 
//   userSubmit() {
//   if (this.registrationForm.valid) {
//     // Call the service to register the user
//     this.authService.registerUser(this.registrationForm.value).subscribe(
//       (response) => {
//         console.log(response); // You can handle the response here
        
//         // Store the account number in the database
//         this.authService.storeAccountNumber(this.generatedNumber).subscribe(
//           (storeResponse) => {
//             console.log('Account number stored successfully:', storeResponse);
//           },
//           (storeError) => {
//             console.error('Error storing account number:', storeError);
//           }
//         );
//         // Optionally, navigate to a success page or perform other actions
//       },
//       (error) => {
//         console.error(error); // Handle errors
//       }
//     );
//   }
//   const constantPart = 12345; // Your first 5 constant digits
//   const randomPart = Math.floor(Math.random() * 100000000000);
//   this.generatedNumber = constantPart * 100000000000 + randomPart;

//   // Save the generated number to localStorage
//   localStorage.setItem('NewAccountNumber', this.generatedNumber.toString());

//   console.log(this.generatedNumber);
//    // Assign the generated number to the new variable
//    this.ACCOUNTNUMBER = this.generatedNumber;
// }

userSubmit() {
  if (this.registrationForm.valid) {
    // Call the service to register the user
    this.authService.registerUser(this.registrationForm.value).subscribe(
      (response) => {
        console.log('Registration response:', response); // Log the registration response

        // Check if the response indicates a successful registration
        if (response) {
          console.log('Registration successful. Generating and storing account number...');

          // Generate and store the account number only if registration is successful
         
        } else {
          console.error('User registration was not successful.');
        }
      },
      (error) => {
        console.error('Error during registration:', error); // Log the registration error
      }
    );
  }
}

generateAndStoreAccountNumber() {
  // Generate the account number
  const constantPart = 12345; // Your first 5 constant digits
  const randomPart = Math.floor(Math.random() * 100000000000);
  this.generatedNumber = constantPart * 100000000000 + randomPart;

  // Save the generated number to localStorage
  localStorage.setItem('NewAccountNumber', this.generatedNumber.toString());

  console.log(this.generatedNumber);

  // Assign the generated number to the new variable
  this.ACCOUNTNUMBER = this.generatedNumber;

  // Store the account number in the database
  this.authService.storeAccountNumber(this.generatedNumber).subscribe(
    (storeResponse) => {
      console.log('Account number stored successfully:', storeResponse);
    },
    (storeError) => {
      console.error('Error storing account number:', storeError);
    }
  );
}



  }


