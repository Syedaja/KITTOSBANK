// check-form-component.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankserviceService } from '../bankservice.service';

@Component({
  selector: 'app-check-form-component',
  templateUrl: './check-form-component.component.html',
  styleUrls: ['./check-form-component.component.css']
})
export class CheckFormComponentComponent {
  checkForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private databaseService: BankserviceService) {
    this.checkForm = this.fb.group({
      adhar_number: ['', Validators.required],
      mobilenumber: ['', Validators.required]
    });
  }

  // check-form-component.component.ts

onSubmit() {
  if (this.checkForm) {
  
    const mobilenumber = this.checkForm.get('mobilenumber')!.value;

    this.databaseService.checkDatabase( mobilenumber).subscribe(
      (response) => {
        // Handle the response from the server
        console.log(response);

        if (response.error === 'duplicateMobile') {
          this.errorMessage = response.message;
        } else {
          // Clear any existing error message
          this.errorMessage = null;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}

}
