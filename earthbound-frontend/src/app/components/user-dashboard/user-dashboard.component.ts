import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  orders: any[] = [];
  userName: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      const name = user?.username || user?.name;
      this.userName = (name && name !== 'undefined') ? name : 'Explorer';
    });

    this.orderService.getMyOrders().subscribe(res => {
      this.orders = res;
    });
  }
}
