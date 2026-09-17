import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  required,
  minLength,
  maxLength,
  pattern,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormField, FormRoot, RouterLink],
  templateUrl: './signup.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './signup.css',
})
export class Signup {
  private authService = inject(AuthService);
  private router = inject(Router);

  
  selectedFile: File | null = null;

  
  signupError = signal('');

  signupModel = signal({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });

  signupForm = form(
    this.signupModel,
    (schema) => {
      required(schema.firstName, { message: 'First name is required' });
      minLength(schema.firstName, 2, { message: 'First name minimum length is 2 characters' });
      maxLength(schema.firstName, 50, { message: 'First name maximum length is 50 characters' });

      required(schema.lastName, { message: 'Last name is required' });
      minLength(schema.lastName, 2, { message: 'Last name minimum length is 2 characters' });
      maxLength(schema.lastName, 50, { message: 'Last name maximum length is 50 characters' });

      required(schema.email, { message: 'Email is required' });
      pattern(schema.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Invalid email' });

      required(schema.password, { message: 'Password is required' });
      minLength(schema.password, 8, { message: 'Password must be at least 8 characters long' });

      pattern(schema.phone, /^\+?[0-9]{10,15}$/, {
        message: 'Please provide a valid phone number',
      });
    },
    {
      submission: {
        action: async (field) => {
          this.signupError.set('');
          const value = field().value();

          const formData = new FormData();
          formData.append('firstName', value.firstName);
          formData.append('lastName', value.lastName);
          formData.append('email', value.email);
          formData.append('password', value.password);

          if (value.phone) {
            formData.append('phone', value.phone);
          }

          if (this.selectedFile) {
            formData.append('imageUrl', this.selectedFile);
          }

          try {
            await firstValueFrom(this.authService.signup(formData));
            
            this.router.navigateByUrl('/student-dashboard');
            return;
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to sign up.';
            this.signupError.set(message);
            return {
              kind: 'serverError',
              message,
            };
          }
        },
      },
    },
  );

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
}
