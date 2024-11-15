import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  toast$ = this.toastSubject.asObservable();

  show(toast: Toast) {
    this.toastSubject.next(toast);
  }
}
