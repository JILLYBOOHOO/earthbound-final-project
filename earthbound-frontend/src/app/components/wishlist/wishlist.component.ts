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
    this.loadWishlist();
  }

  loadWishlist() {
    const data = localStorage.getItem('wishlist');
    this.wishlistItems = data ? JSON.parse(data) : [];
  }

  removeItem(index: number) {
    const item = this.wishlistItems[index];
    this.wishlistItems.splice(index, 1);
    this.wishlistItems = [...this.wishlistItems];
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
    this.toastService.info(`${item.name || 'Item'} removed from wishlist.`);
  }

  addToCart(item: any) {
    this.cartService.addToCart(item);
    this.toastService.success(`${item.name || 'Item'} added to cart!`);
  }

  viewProduct(item: any) {
    // Navigate to shop with this product's name as search to "view" it
    this.toastService.info(`Viewing details for ${item.name}...`);
  }
}
