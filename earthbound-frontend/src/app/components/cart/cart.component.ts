import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

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
    private toastService: ToastService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.total = this.cartService.total;
  }

  updateQuantity(productId: number, delta: number) {
    this.cartService.updateQuantity(productId, delta);
  }

  removeItem(productId: number, name: string) {
    this.cartService.removeProduct(productId);
    this.toastService.info(`${name} removed from cart.`);
  }

  clearCart() {
    this.cartService.clearCart();
    this.toastService.info('Cart cleared.');
  }

  checkout() {
    if (this.cartItems.length === 0) return;
    
    if (!this.authService.isLoggedIn()) {
      const proceed = window.confirm('Would you like to log in or sign up to complete your order?');
      if (proceed) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      }
      return;
    }

    this.router.navigate(['/checkout']);
  }

  getCartItemImage(item: any): string {
    return item.product?.image_url || item.image_url || 'assets/placeholder.png';
  }
}
