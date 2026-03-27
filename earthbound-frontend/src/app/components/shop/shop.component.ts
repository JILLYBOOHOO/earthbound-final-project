import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Subject, debounceTime } from 'rxjs';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  products: Product[] = [];
  loading: boolean = false;

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
    private toastService: ToastService
  ) {}

  ngOnInit() {

    // 🔥 Debounce filter changes
    this.filterChanged.pipe(
      debounceTime(400)
    ).subscribe(() => {
      this.fetchProducts();
    });

    // 🔥 URL search param
    this.route.queryParams.subscribe(params => {
      this.filters.search = params['search'] || '';
      this.triggerFilter();
    });
  }

  fetchProducts() {
    this.loading = true;

    this.productService.getProducts(this.filters).subscribe({
      next: (res: Product[]) => {
        this.products = res;
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

  // ===== CART =====
  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastService.success(`${product.name} added to cart!`);
  }

  // ===== WISHLIST =====
  addToWishlist(product: Product) {
    const wishlist: Product[] = JSON.parse(localStorage.getItem('wishlist') || '[]');

    const exists = wishlist.some(item => item.id === product.id);

    if (!exists) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      this.toastService.success(`${product.name} added to wishlist!`);
    } else {
      this.toastService.info(`${product.name} is already in your wishlist.`);
    }
  }
}