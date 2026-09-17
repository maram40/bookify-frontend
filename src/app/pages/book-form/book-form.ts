import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookForm implements OnInit {
  private bookService = inject(BookService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  
  bookId = signal<string | null>(null);

  selectedFile: File | null = null;
  submitting = signal(false);
  errorMessage = signal('');
  loadingBook = signal(false);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.bookId.set(params['id'] ?? null);
    });
  }

  bookForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    category: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    description: new FormControl('', [Validators.maxLength(1000)]),
  });

  ngOnInit(): void {
    const id = this.bookId();

    if (id) {
      this.loadingBook.set(true);

      this.bookService.getBookById(id).subscribe({
        next: (book) => {
          this.bookForm.patchValue({
            title: book.title,
            category: book.category,
            price: book.price,
            description: book.description ?? '',
          });
          this.loadingBook.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err instanceof Error ? err.message : 'Failed to load book.');
          this.loadingBook.set(false);
        },
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const formValue = this.bookForm.value;
    const formData = new FormData();

    formData.append('title', formValue.title ?? '');
    formData.append('category', formValue.category ?? '');
    formData.append('price', String(formValue.price ?? 0));

    if (formValue.description) {
      formData.append('description', formValue.description);
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    const id = this.bookId();
    const request = id
      ? this.bookService.updateBook(id, formData)
      : this.bookService.createBook(formData);

    request.subscribe({
      next: () => {
        this.submitting.set(false);
        // Book Form only lives under the Admin Dashboard's book-management
        // routes, so saving/cancelling always returns there.
        this.router.navigateByUrl('/admin-dashboard');
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err instanceof Error ? err.message : 'Failed to save book.');
      },
    });
  }

  onCancel() {
    this.router.navigateByUrl('/admin-dashboard');
  }
}
