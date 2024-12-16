import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapSnackbarComponent } from './bootstrap-snackbar.component';

describe('BootstrapSnackbarComponent', () => {
  let component: BootstrapSnackbarComponent;
  let fixture: ComponentFixture<BootstrapSnackbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BootstrapSnackbarComponent]
    });
    fixture = TestBed.createComponent(BootstrapSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
