import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';



@Component({
  selector: 'app-my-modal',
  styles: [`
    .modal-dialog {
      max-width: 600px;
      margin: auto;
    }

    .modal-content {
      border: 2px solid #242526;
      border-radius: 0px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      background-color: #242526;
      color: #007BFF;
      border-bottom: 1px solid #297ca0;
      border-radius:0px;
      
    }

    .modal-title {
      font-weight: bold;
    }

    .modal-body {
      padding: 20px;
      text-align: center;
    }

    .modal-footer {
      background-color: #242526;
      border-top: 1px solid #e5e5e5;
      border-radius: 0px;
      text-align: right;
    }

    .btn-secondary {
      background-color: #007BFF !important;
      color: #fff;
      border: 1px solid #007BFF;
      border-radius: 0px;
    }

    .btn-secondary:hover {
      background-color: #DF1C24 !important;
    }
  `],
  template: `
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Transaction Details</h4>
          <button type="button" class="close" aria-label="Close" (click)="onclose()">
            <span aria-hidden="true" style="color: #007BFF;">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p><strong>Account Number:</strong> {{ accountNumber }}</p>
          <p><strong>Transaction Type:</strong> {{ transactionType }}</p>
          <p><strong>Amount:</strong> {{ amount }}</p>
          <p><strong>Date & Time:</strong> {{ formatIndianDateTime() || 'N/A' }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" (click)="onclose()">Close</button>
        </div>
      </div>
    </div>
  `,
})
export class MyModalComponent {
  accountNumber!: number;
  transactionType!: string;
  amount!: number;
  formattedDateTime: string | null;

  constructor(public bsModalRef: BsModalRef) {
    this.formattedDateTime = this.formatIndianDateTime();
  }
  formatIndianDateTime(): string {
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata' // Set the timezone to Indian Standard Time (IST)
    };
    return currentDate.toLocaleString('en-IN', options);
  }

  // close and refresh the page 
  onclose(){
    //close the modal
    this.bsModalRef.hide();
    //reload the current page
    window.location.reload();
  }
}
