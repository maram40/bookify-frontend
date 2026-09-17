import { Routes } from '@angular/router';

import { Signin } from './pages/signin/signin';
import { Signup } from './pages/signup/signup';
import { BookList } from './pages/book-list/book-list';
import { BookDetails } from './pages/book-details/book-details';
import { BookForm } from './pages/book-form/book-form';
import { Cart } from './pages/cart/cart';
import { Profile } from './pages/profile/profile';

import { StudentDashboard } from './layout/student-dashboard/student-dashboard';
import { AdminDashboard } from './layout/admin-dashboard/admin-dashboard';

import { rootGuard } from './guards/root.guard';
import { studentGuard } from './guards/student.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Signin, canActivate: [rootGuard], title: 'Sign In' },

  { path: 'signin', component: Signin, title: 'Sign In' },
  { path: 'signup', component: Signup, title: 'Sign Up' },

  {
    path: 'student-dashboard',
    component: StudentDashboard,
    canActivate: [studentGuard],
    title: 'Student Dashboard',
    children: [
      { path: '', component: BookList, title: 'Home', data: { viewMode: 'grid' } },
      { path: 'search', component: BookList, title: 'Search', data: { viewMode: 'list' } },
      { path: 'book-details/:id', component: BookDetails, title: 'Book Details' },
      { path: 'cart', component: Cart, title: 'Cart' },
      { path: 'profile', component: Profile, title: 'Profile' },
    ],
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [adminGuard],
    title: 'Admin Dashboard',
    children: [
      { path: '', component: BookList, title: 'Manage Books', data: { viewMode: 'grid' } },
      { path: 'add-book', component: BookForm, title: 'Add Book' },
      { path: 'edit-book/:id', component: BookForm, title: 'Edit Book' },
      { path: 'book-details/:id', component: BookDetails, title: 'Book Details' },
      { path: 'profile', component: Profile, title: 'Profile' },
    ],
  },

  { path: '**', redirectTo: 'signin' },
];
