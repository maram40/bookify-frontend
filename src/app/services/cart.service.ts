import { Service, computed, effect, signal } from '@angular/core';
import { Book } from '../models/book.model';


@Service()
export class CartService {
  private readonly _items = signal<Book[]>([]);

  readonly items = this._items.asReadonly();

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, book) => sum + book.price, 0),
  );

  constructor() {
    effect(() => {
      console.log('Cart items count:', this._items().length);
    });
  }

  addToCart(book: Book) {
    this._items.update((items) => [...items, book]);
  }

  removeFromCart(index: number) {
    this._items.update((items) => items.filter((_, i) => i !== index));
  }

  clearCart() {
    this._items.set([]);
  }
}
