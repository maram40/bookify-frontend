import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = signal<User | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.user.set(res.data.user);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err instanceof Error ? err.message : 'Failed to load profile.');
        this.loading.set(false);
      },
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/signin');
  }
}
