import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetails implements OnInit {
  private bookService = inject(BookService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);

 
  isAdmin = this.authService.getRole() === 'admin';

  bookId = signal('');

  book = signal<Book | null>(null);
  loading = signal(true);
  errorMessage = signal('');
  addedToCart = signal(false);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.bookId.set(params['id']);
    });
  }

  ngOnInit(): void {
    this.bookService.getBookById(this.bookId()).subscribe({
      next: (book) => {
        this.book.set(book);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err instanceof Error ? err.message : 'Failed to load book.');
        this.loading.set(false);
      },
    });
  }

  addToCart() {
    const currentBook = this.book();
    if (!currentBook) {
      return;
    }
    this.cartService.addToCart(currentBook);
    this.addedToCart.set(true);
  }

  goBack() {
    this.location.back();
  }
}
