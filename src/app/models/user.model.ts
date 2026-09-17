export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'admin';
  phone?: string;
  imageUrl: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}
