import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentView: string = 'overview';
  products: any[] = [];
  orders: any[] = [];
  users: any[] = [];

  productForm: any = {
    name: '', description: '', price: 0,
    category: 'Tents', activity: 'Camping',
    image_url: '', stock: 0
  };
  editingProductId: number | null = null;
  imagePreviewUrl: string = '';

  notification: { message: string; type: string } | null = null;
  deleteConfirm: { show: boolean; productId: number | null; productName: string } = {
    show: false, productId: null, productName: ''
  };

  stats = { products: 0, orders: 0, users: 0, revenue: 0 };

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.fetchAll();
  }

  fetchAll() {
    this.productService.getProducts({}).subscribe(res => {
      this.products = res;
      this.stats.products = res.length;
    });
    this.orderService.getAllOrders().subscribe(res => {
      this.orders = res;
      this.stats.orders = res.length;
      this.stats.revenue = res.reduce((sum: number, o: any) => sum + parseFloat(o.total_price || 0), 0);
    });
    this.authService.getUsers().subscribe(res => {
      this.users = res;
      this.stats.users = res.length;
    });
  }

  changeView(view: string) {
    this.currentView = view;
    if (view === 'add-product') {
      this.resetProductForm();
      this.editingProductId = null;
    }
  }

  // ─── Product CRUD ───────────────────────────────────────
  resetProductForm() {
    this.productForm = {
      name: '', description: '', price: 0,
      category: 'Tents', activity: 'Camping',
      image_url: '', stock: 0
    };
    this.imagePreviewUrl = '';
  }

  onImageUrlChange() {
    this.imagePreviewUrl = this.productForm.image_url;
  }

  editProduct(prod: any) {
    this.productForm = { ...prod };
    this.editingProductId = prod.id;
    this.imagePreviewUrl = prod.image_url || '';
    this.currentView = 'add-product';
  }

  saveProduct() {
    if (this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, this.productForm).subscribe({
        next: () => {
          this.showNotification('Product updated successfully!', 'success');
          this.editingProductId = null;
          this.changeView('products');
          this.fetchAll();
        },
        error: () => this.showNotification('Failed to update product.', 'error')
      });
    } else {
      this.productService.createProduct(this.productForm).subscribe({
        next: () => {
          this.showNotification('Product added successfully!', 'success');
          this.changeView('products');
          this.fetchAll();
        },
        error: () => this.showNotification('Failed to add product.', 'error')
      });
    }
  }

  confirmDelete(prod: any) {
    this.deleteConfirm = { show: true, productId: prod.id, productName: prod.name };
  }

  cancelDelete() {
    this.deleteConfirm = { show: false, productId: null, productName: '' };
  }

  executeDelete() {
    if (this.deleteConfirm.productId) {
      this.productService.deleteProduct(this.deleteConfirm.productId).subscribe({
        next: () => {
          this.showNotification('Product deleted.', 'success');
          this.cancelDelete();
          this.fetchAll();
        },
        error: () => this.showNotification('Failed to delete product.', 'error')
      });
    }
  }

  // ─── Orders ─────────────────────────────────────────────
  updateOrder(order: any) {
    this.orderService.updateOrderStatus(order.id, order.shipping_status, order.tracking_number).subscribe({
      next: () => this.showNotification('Order updated!', 'success'),
      error: () => this.showNotification('Failed to update order.', 'error')
    });
  }

  // ─── Notifications ─────────────────────────────────────
  showNotification(message: string, type: string) {
    this.notification = { message, type };
    setTimeout(() => this.notification = null, 3500);
  }
}
