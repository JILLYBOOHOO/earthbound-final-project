import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  portalType: 'user' | 'admin' = 'user';
  credentials: any = { email: '', password: '' };
  loading: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastService: ToastService
  ) { }

  setPortal(type: 'user' | 'admin') {
    this.portalType = type;
  }

  onLogin() {
    this.loading = true;
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.loading = false;
        
        if (this.portalType === 'admin' && res.role !== 'admin') {
          this.toastService.error('Access Denied: Admin privileges required');
          this.authService.logout();
          this.portalType = 'user'; // reset to user
          return;
        }

        this.toastService.success('Welcome back!');
        if (res.role === 'admin') this.router.navigate(['/admin']);
        else this.router.navigate(['/shop']);
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error('Invalid email or password');
      }
    });
  }
}
