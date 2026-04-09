import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  paymentMethod: 'card' | 'paypal' = 'card';
  loading: boolean = false;
  userName: string = '';

  cardDetails = {
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  };

  shippingDetails = {
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: ''
  };

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.total;
      
      if (this.cartItems.length === 0) {
        this.router.navigate(['/cart']);
      }
    });

    this.authService.currentUser.subscribe(user => {
      this.userName = user?.username || user?.name || '';
    });
  }

  setPaymentMethod(method: 'card' | 'paypal') {
    this.paymentMethod = method;
  }

  showSuccess: boolean = false;
  successOrderId: string = '';

  processPayment() {
    if (this.paymentMethod === 'card') {
      if (!this.cardDetails.number || !this.cardDetails.expiry || !this.cardDetails.cvv) {
        this.toastService.error('Please enter complete credit card details.');
        return;
      }
    }

    this.loading = true;
    this.toastService.info('Processing your expedition gear payment...');
    
    setTimeout(() => {
      const orderData = {
        items: this.cartItems.map(item => ({
          product_id: item.product?.id || item.id,
          quantity: item.quantity || 1,
          price: item.product?.price || item.price
        })),
        total_price: this.total,
        payment_method: this.paymentMethod,
        shipping_address: `${this.shippingDetails.address1}, ${this.shippingDetails.city}, ${this.shippingDetails.state} ${this.shippingDetails.zip}`,
        customer_name: `${this.shippingDetails.firstName} ${this.shippingDetails.lastName}`
      };

      this.orderService.placeOrder(orderData).subscribe({
        next: (res) => {
          this.loading = false;
          this.successOrderId = res.id;
          this.showSuccess = true;
          this.toastService.success('Payment Successful! Welcome to the team.');
          this.cartService.clearCart();
          
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 4000);
        },
        error: (err) => {
          this.loading = false;
          this.toastService.error('Payment failed: Transaction declined');
        }
      });
    }, 1500); // Artificial delay for "Processing" feel
  }
}
