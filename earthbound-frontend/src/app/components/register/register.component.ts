import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = { username: '', email: '', password: '', role: 'user' };
  loading: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    public route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  setRole(role: 'user' | 'admin') {
    this.user.role = role;
  }

  onRegister() {
    this.loading = true;
    this.authService.register(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.success('Explore status acquired! Please login.');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        this.router.navigate(['/login'], { queryParams: { returnUrl } });
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error(err.error?.message || 'Enrollment failed');
      }
    });
  }
}
