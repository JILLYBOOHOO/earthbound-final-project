import { Component, OnInit } from '@angular/core';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" class="toast" [ngClass]="toast.type">
        {{ toast.message }}
      </div>
    </div>
  `,
  styles: []
})
export class ToastComponent implements OnInit {
  toasts: ToastMessage[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toast$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t !== toast);
      }, 3000);
    });
  }
}
