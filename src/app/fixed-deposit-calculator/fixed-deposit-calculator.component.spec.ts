import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedDepositCalculatorComponent } from './fixed-deposit-calculator.component';

describe('FixedDepositCalculatorComponent', () => {
  let component: FixedDepositCalculatorComponent;
  let fixture: ComponentFixture<FixedDepositCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FixedDepositCalculatorComponent]
    });
    fixture = TestBed.createComponent(FixedDepositCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
