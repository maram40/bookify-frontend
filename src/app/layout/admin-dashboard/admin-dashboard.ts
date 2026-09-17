import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-dashboard.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/signin');
  }
}
