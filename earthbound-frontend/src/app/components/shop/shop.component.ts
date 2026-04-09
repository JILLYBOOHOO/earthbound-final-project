import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { Subject, debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity?: number; // Added for selection
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ShopComponent implements OnInit {

  products: Product[] = [];
  loading: boolean = false;
  userName: string = '';

  private filterChanged = new Subject<void>();

  filters = {
    search: '',
    activity: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    sort: ''
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private toastService: ToastService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit() {

    this.authService.currentUser.subscribe(user => {
      this.userName = user?.username || user?.name || '';
    });

    // 🔥 Debounce filter changes
    this.filterChanged.pipe(
      debounceTime(400)
    ).subscribe(() => {
      this.fetchProducts();
    });

    // 🔥 URL search param & filters
    this.route.queryParams.subscribe(params => {
      this.filters.search = params['search'] || '';
      this.filters.category = params['category'] || '';
      this.filters.activity = params['activity'] || '';
      this.triggerFilter();
    });
  }

  fetchProducts() {
    this.loading = true;

    this.productService.getProducts(this.filters).subscribe({
      next: (res: Product[]) => {
        this.products = res.map(p => ({ ...p, quantity: 1 })); // Initialize quantity
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load products');
        this.loading = false;
      }
    });
  }

  // 🔥 central trigger
  triggerFilter() {
    this.filterChanged.next();
  }

  // ===== FILTER HANDLERS =====

  onCategoryChange(event: any) {
    this.filters.category = event.target.value;
    this.triggerFilter();
  }

  onActivityChange(event: any) {
    this.filters.activity = event.target.value;
    this.triggerFilter();
  }

  onMinPriceChange(event: any) {
    this.filters.minPrice = +event.target.value;
    this.triggerFilter();
  }

  onMaxPriceChange(event: any) {
    this.filters.maxPrice = +event.target.value;
    this.triggerFilter();
  }

  onSortChange(event: any) {
    this.filters.sort = event.target.value;
    this.triggerFilter();
  }

  clearFilters() {
    this.filters = {
      search: '',
      activity: '',
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      sort: ''
    };
    this.triggerFilter();
  }

  // ===== CART & PURCHASE =====
  increaseQuantity(product: Product) {
    product.quantity = (product.quantity || 1) + 1;
  }

  decreaseQuantity(product: Product) {
    if ((product.quantity || 1) > 1) {
      product.quantity = (product.quantity || 1) - 1;
    }
  }

  addToCart(product: Product) {
    const qty = product.quantity || 1;
    this.cartService.addToCart(product, qty);
    this.toastService.success(`${qty}x ${product.name} added to cart!`);
    product.quantity = 1; // Reset selection
  }

  buyNow(product: Product) {
    const qty = product.quantity || 1;
    this.cartService.addToCart(product, qty);
    this.router.navigate(['/cart']);
  }

  // ===== WISHLIST =====
  isInWishlist(product: Product): boolean {
    return this.wishlistService.isInWishlist(product.id);
  }

  addToWishlist(product: Product) {
    const isAdded = this.wishlistService.toggleWishlist(product);
    
    if (isAdded) {
      this.toastService.success(`${product.name} added to wishlist!`);
    } else {
      this.toastService.info(`${product.name} removed from wishlist`);
    }
  }
}