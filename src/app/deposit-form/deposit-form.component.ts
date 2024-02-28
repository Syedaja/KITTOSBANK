import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-deposit-form',
  templateUrl: './deposit-form.component.html',
  styleUrls: ['./deposit-form.component.css']
})
export class DepositFormComponent implements OnInit {
  transactionForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.transactionForm = this.formBuilder.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      transactionType: ['deposit', Validators.required]
    });

    
  }

  updateValidation() {
    const amountControl = this.transactionForm.get('amount');
    const transactionType = this.transactionForm.get('transactionType')?.value;
  
    if (transactionType === 'deposit') {
      if (amountControl?.touched && (amountControl?.value === null || amountControl?.value === '')) {
        amountControl.setErrors({ 'required': true });
      } else if (amountControl?.value > 49000) {
        amountControl?.setErrors({ 'invalidAmount': true });
      } else {
        amountControl?.setErrors(null);
      }
    } else if (transactionType === 'debit') {
      if (amountControl?.touched && (amountControl?.value === null || amountControl?.value === '')) {
        amountControl.setErrors({ 'required': true });
      } else {
        amountControl?.setErrors(null);
      }

      
    }

    
  }
  
  
}
