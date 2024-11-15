import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCalendarComponent } from './modal-calendar.component';

describe('ModalCalendarComponent', () => {
  let component: ModalCalendarComponent;
  let fixture: ComponentFixture<ModalCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCalendarComponent]
    });
    fixture = TestBed.createComponent(ModalCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
