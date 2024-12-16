import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleConfigComponent } from './schedule-config.component';

describe('ScheduleConfigComponent', () => {
  let component: ScheduleConfigComponent;
  let fixture: ComponentFixture<ScheduleConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleConfigComponent]
    });
    fixture = TestBed.createComponent(ScheduleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
