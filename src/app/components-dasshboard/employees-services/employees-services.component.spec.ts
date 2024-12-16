import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesServicesComponent } from './employees-services.component';

describe('EmployeesServicesComponent', () => {
  let component: EmployeesServicesComponent;
  let fixture: ComponentFixture<EmployeesServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeesServicesComponent]
    });
    fixture = TestBed.createComponent(EmployeesServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
