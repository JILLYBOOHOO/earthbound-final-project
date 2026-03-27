import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum: number, item: any) => sum + parseFloat(item.price || 0), 0);
  }

  removeItem(index: number) {
    const item = this.cartItems[index];
    this.cartService.removeFromCart(index);
    this.toastService.info(`${item.name} removed from cart.`);
  }

  clearCart() {
    this.cartService.clearCart();
    this.toastService.info('Cart cleared.');
  }
}
