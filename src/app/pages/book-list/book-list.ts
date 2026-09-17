import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';
import { Book } from '../../models/book.model';
import { BookCard } from '../../components/book-card/book-card';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [BookCard],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  private bookService = inject(BookService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  isAdmin = this.authService.getRole() === 'admin';

  allBooks = signal<Book[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  searchText = signal('');
  selectedCategory = signal('All');
  viewMode = signal<'grid' | 'list'>('grid');

  
  categories = computed(() => {
    const unique = new Set(this.allBooks().map((book) => book.category));
    return ['All', ...Array.from(unique)];
  });

  filteredBooks = computed(() => {
    const search = this.searchText().trim().toLowerCase();
    const category = this.selectedCategory();

    return this.allBooks().filter((book) => {
      const matchesCategory = category === 'All' || book.category === category;
      const matchesSearch = !search || book.title.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  });

  ngOnInit(): void {
    
    const routeViewMode = this.activatedRoute.snapshot.data['viewMode'] as
      | 'grid'
      | 'list'
      | undefined;
    this.viewMode.set(routeViewMode ?? 'grid');
    this.fetchBooks();
  }

  fetchBooks() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.allBooks.set(books);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err instanceof Error ? err.message : 'Failed to load books.');
        this.loading.set(false);
      },
    });
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode.set(mode);
  }

  onDeleteBook(id: string) {
    if (!confirm('Delete this book?')) {
      return;
    }

    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.allBooks.update((books) => books.filter((book) => book._id !== id));
      },
      error: (err) => {
        this.errorMessage.set(err instanceof Error ? err.message : 'Failed to delete book.');
      },
    });
  }

  onAddToCart(book: Book) {
    this.cartService.addToCart(book);
  }

  
  viewBook(id: string) {
    const base = this.isAdmin ? '/admin-dashboard' : '/student-dashboard';
    this.router.navigate([base, 'book-details', id]);
  }

  addBook() {
    this.router.navigate(['/admin-dashboard', 'add-book']);
  }

  editBook(id: string) {
    this.router.navigate(['/admin-dashboard', 'edit-book', id]);
  }
}
