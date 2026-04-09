import { Component, OnInit } from '@angular/core';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" class="toast" [ngClass]="toast.type">
        <div class="toast-icon">
          <i class="fas" [ngClass]="{
            'fa-check-circle': toast.type === 'success',
            'fa-exclamation-circle': toast.type === 'error',
            'fa-info-circle': toast.type === 'info'
          }"></i>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <div class="toast-progress"></div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      max-width: 450px;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(15px);
      border-radius: 16px;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.15);
      border: 1px solid rgba(0,0,0,0.05);
      animation: slideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      overflow: hidden;
      position: relative;
    }

    .toast-icon {
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-message {
      font-weight: 700;
      color: #1a1a1a;
      font-size: 1rem;
      font-family: 'Outfit', sans-serif;
    }

    /* HIGH CONTRAST TYPES */
    .success { border-left: 6px solid #2a6e3f; }
    .success .toast-icon { color: #2a6e3f; }

    .error { border-left: 6px solid #e53e3e; }
    .error .toast-icon { color: #e53e3e; }

    .info { border-left: 6px solid #3182ce; }
    .info .toast-icon { color: #3182ce; }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      background: rgba(0,0,0,0.1);
      width: 100%;
      animation: progress 3s linear forwards;
    }

    .success .toast-progress { background: #2a6e3f; }
    .error .toast-progress { background: #e53e3e; }

    @keyframes slideIn {
      from { transform: translateY(-100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
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
