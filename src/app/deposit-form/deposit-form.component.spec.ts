import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositFormComponent } from './deposit-form.component';

describe('DepositFormComponent', () => {
  let component: DepositFormComponent;
  let fixture: ComponentFixture<DepositFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepositFormComponent]
    });
    fixture = TestBed.createComponent(DepositFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
