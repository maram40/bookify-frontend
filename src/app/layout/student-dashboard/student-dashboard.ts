import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './student-dashboard.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard {}
