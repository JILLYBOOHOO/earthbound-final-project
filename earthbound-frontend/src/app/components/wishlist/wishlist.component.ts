import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];

  constructor(
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
  }

  removeItem(index: number) {
    const item = this.wishlistItems[index];
    this.wishlistItems.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
    this.toastService.info(`${item.name} removed from wishlist.`);
  }

  addToCart(item: any) {
    this.cartService.addToCart(item);
    this.toastService.success(`${item.name} added to cart!`);
  }
}
