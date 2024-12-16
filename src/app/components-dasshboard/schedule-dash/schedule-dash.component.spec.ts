import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDashComponent } from './schedule-dash.component';

describe('ScheduleDashComponent', () => {
  let component: ScheduleDashComponent;
  let fixture: ComponentFixture<ScheduleDashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleDashComponent]
    });
    fixture = TestBed.createComponent(ScheduleDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
