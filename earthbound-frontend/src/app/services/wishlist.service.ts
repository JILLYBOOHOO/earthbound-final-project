import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<any[]>(this.loadWishlist());
  wishlist$ = this.wishlistSubject.asObservable();

  constructor() { }

  private loadWishlist(): any[] {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  }

  get items(): any[] {
    return this.wishlistSubject.value;
  }

  get count(): number {
    return this.wishlistSubject.value.length;
  }

  toggleWishlist(product: any) {
    const current = this.wishlistSubject.value;
    const existsIndex = current.findIndex(item => item.id === product.id);
    
    let updated;
    if (existsIndex === -1) {
      updated = [...current, product];
    } else {
      updated = current.filter(item => item.id !== product.id);
    }

    localStorage.setItem('wishlist', JSON.stringify(updated));
    this.wishlistSubject.next(updated);
    
    return existsIndex === -1; // returns true if added, false if removed
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistSubject.value.some(item => item.id === productId);
  }
}
