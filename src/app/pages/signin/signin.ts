import { Component, ViewChild, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signin.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './signin.css',
})
export class Signin {
  @ViewChild('loginForm') loginForm!: NgForm;

  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal('');
  submitting = signal(false);

  onSubmit() {
    this.errorMessage.set('');
    this.submitting.set(true);

    this.authService.signin(this.loginForm.value).subscribe({
      next: () => {
        this.submitting.set(false);
        this.loginForm.reset();

        
        const role = this.authService.getRole();
        this.router.navigateByUrl(role === 'admin' ? '/admin-dashboard' : '/student-dashboard');
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err instanceof Error ? err.message : 'Invalid email or password.');
      },
    });
  }
}
