import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);

  removeItem(index: number) {
    this.cartService.removeFromCart(index);
  }

  clear() {
    this.cartService.clearCart();
  }
}
