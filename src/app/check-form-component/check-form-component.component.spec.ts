import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckFormComponentComponent } from './check-form-component.component';

describe('CheckFormComponentComponent', () => {
  let component: CheckFormComponentComponent;
  let fixture: ComponentFixture<CheckFormComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckFormComponentComponent]
    });
    fixture = TestBed.createComponent(CheckFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
