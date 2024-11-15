import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-calendar',
  templateUrl: './modal-calendar.component.html',
})
export class ModalCalendarComponent {
  private _title: string = '';

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<{
    title: string;
  }>();

  ngOnInit() {
    console.log('Modal Calendar initialized');
  }

  close() {
    // Reset form fields
    this._title = '';

    this.closeModal.emit();
  }

  save() {
    if (this._title) {
      this.saveEvent.emit({
        title: this._title,
      });
      // Reset form fields after saving
      this._title = '';
    } else {
      alert('Please fill in the task title.');
    }
  }
}
