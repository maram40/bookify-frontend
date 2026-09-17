import { Component, input, output } from '@angular/core';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css',
})
export class BookCard {
  book = input.required<Book>();
  viewMode = input<'grid' | 'list'>('grid');
  isAdmin = input<boolean>(false);

  view = output<string>();
  edit = output<string>();
  remove = output<string>();
  addToCart = output<Book>();

  onView() {
    this.view.emit(this.book()._id);
  }

  onEdit() {
    this.edit.emit(this.book()._id);
  }

  onDelete() {
    this.remove.emit(this.book()._id);
  }

  onAddToCart() {
    this.addToCart.emit(this.book());
  }
}
