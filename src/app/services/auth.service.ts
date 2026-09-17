import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { ApiResponse, User } from '../models/user.model';

interface SigninCredentials {
  email: string;
  password: string;
}

interface DecodedToken {
  id: string;
  role: 'student' | 'admin';
  iat: number;
  exp: number;
}


type AuthResponse = ApiResponse<{ user: User }> & { token: string };


@Service()
export class AuthService {
  private readonly authBaseUrl = 'http://localhost:5000/api/v1/auth';
  private readonly usersBaseUrl = 'http://localhost:5000/api/v1/users';

  private httpClient = inject(HttpClient);

  signup(formData: FormData) {
    return this.httpClient.post<AuthResponse>(`${this.authBaseUrl}/signup`, formData).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
      }),
    );
  }

  signin(credentials: SigninCredentials) {
    return this.httpClient.post<AuthResponse>(`${this.authBaseUrl}/signin`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
      }),
    );
  }

  getProfile() {
    return this.httpClient.get<ApiResponse<{ user: User }>>(`${this.usersBaseUrl}/profile`);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const expirationDate = new Date(decoded.exp * 1000);

      if (expirationDate < new Date()) {
        localStorage.removeItem('token');
        return false;
      }

      return true;
    } catch {
      localStorage.removeItem('token');
      return false;
    }
  }

  getRole(): 'student' | 'admin' | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      return jwtDecode<DecodedToken>(token).role;
    } catch {
      return null;
    }
  }
}
