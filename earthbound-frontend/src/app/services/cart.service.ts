import { Injectable } from '@angular/core';
  import { BehaviorSubject } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class CartService {
    private cartItems: any[] = [];
    private cartSubject = new BehaviorSubject<any[]>([]);
    cart$ = this.cartSubject.asObservable();

    constructor() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
        this.cartSubject.next(this.cartItems);
      }
    }

    getCartItems() {
      return this.cartItems;
    }

    addToCart(product: any) {
      this.cartItems.push(product);
      this.saveCart();
    }

    removeFromCart(index: number) {
      this.cartItems.splice(index, 1);
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
      return this.cartItems.length;
    }
  }
  
