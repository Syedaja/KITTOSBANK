import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-fixed-deposit-calculator',
  templateUrl: './fixed-deposit-calculator.component.html',
  styleUrls: ['./fixed-deposit-calculator.component.css']
})
export class FixedDepositCalculatorComponent implements OnInit {

  ngOnInit(): void {
   
  }
  principal: number | null = null;
  tenure: number | null = null;
  maturityAmount: number | null = null;

  calculateMaturity() {
    if (this.principal !== null && this.tenure !== null) {
      let interestRate: number;

      if (this.tenure >= 3 && this.tenure <= 5) {
        interestRate = 1; // 5% interest for 3 to 5 years
      } else if (this.tenure >= 10 && this.tenure <= 15) {
        interestRate = 6.5; // 6.5% interest for 10 to 15 years
      } else if (this.tenure >= 20 && this.tenure <= 30) {
        interestRate = 10; // 10% interest for 20 to 30 years
      } else {
        interestRate = 0; // Default interest rate for other tenures
      }

      const principalAmount = parseFloat(this.principal.toString());
      const numberOfMonths = parseFloat(this.tenure.toString()) * 12;

      const maturityAmount = principalAmount + (principalAmount * (interestRate / 100) * numberOfMonths);
      this.maturityAmount = maturityAmount;
    } else {
      this.maturityAmount = null;
    }
  }
}
