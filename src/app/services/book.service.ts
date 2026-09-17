import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book } from '../models/book.model';


@Service()
export class BookService {
  private readonly baseUrl = 'http://localhost:5000/books';

  private httpClient = inject(HttpClient);

  getAllBooks(): Observable<Book[]> {
    return this.httpClient.get<any>(this.baseUrl).pipe(map((res) => res.data.books));
  }

  getBookById(id: string): Observable<Book> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}`).pipe(map((res) => res.data.book));
  }

  
  createBook(formData: FormData): Observable<Book> {
    return this.httpClient.post<any>(this.baseUrl, formData).pipe(map((res) => res.data.book));
  }

  updateBook(id: string, formData: FormData): Observable<Book> {
    return this.httpClient
      .patch<any>(`${this.baseUrl}/${id}`, formData)
      .pipe(map((res) => res.data.book));
  }

  
  deleteBook(id: string): Observable<void> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`).pipe(map(() => undefined));
  }
}
