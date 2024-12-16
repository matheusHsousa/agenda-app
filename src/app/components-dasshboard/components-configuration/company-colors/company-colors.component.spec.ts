import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyColorsComponent } from './company-colors.component';

describe('CompanyColorsComponent', () => {
  let component: CompanyColorsComponent;
  let fixture: ComponentFixture<CompanyColorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyColorsComponent]
    });
    fixture = TestBed.createComponent(CompanyColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
