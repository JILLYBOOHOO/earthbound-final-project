import { Injectable } from '@angular/core';
  import { BehaviorSubject } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class CartService {
    private cartItems: any[] = []; // Array of { product, quantity }
    private cartSubject = new BehaviorSubject<any[]>([]);
    cart$ = this.cartSubject.asObservable();

    constructor() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const rawItems = JSON.parse(savedCart);
        // Migration: If the first item doesn't have a 'product' property, it's the old format
        if (rawItems.length > 0 && !rawItems[0].product) {
          this.cartItems = rawItems.map((p: any) => ({ product: p, quantity: 1 }));
          this.saveCart(); // Save the migrated format
        } else {
          this.cartItems = rawItems;
        }
        // Validate: if any product is missing image_url, the data is stale — clear it
        const hasStaleData = this.cartItems.some(item => !item.product?.image_url);
        if (hasStaleData) {
          console.warn('[CartService] Stale cart data detected (missing image_url). Clearing cart for fresh data.');
          this.cartItems = [];
          localStorage.removeItem('cart');
        }
        this.cartSubject.next(this.cartItems);
      }
    }

    addToCart(product: any, qty: number = 1) {
      const existing = this.cartItems.find(item => item.product.id === product.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        this.cartItems.push({ product, quantity: qty });
      }
      this.saveCart();
    }

    updateQuantity(productId: number, delta: number) {
      const existing = this.cartItems.find(item => item.product.id === productId);
      if (existing) {
        existing.quantity += delta;
        if (existing.quantity <= 0) {
          this.removeProduct(productId);
        } else {
          this.saveCart();
        }
      }
    }

    removeProduct(productId: number) {
      this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
      this.saveCart();
    }

    clearCart() {
      this.cartItems = [];
      this.saveCart();
    }

    private saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      this.cartSubject.next([...this.cartItems]);
    }

    get itemCount() {
      return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    }

    get total() {
      return this.cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    }
  }
  
