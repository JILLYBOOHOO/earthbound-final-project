import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3100/api/orders';

  constructor(private http: HttpClient) { }

  private getAuthHeader() {
    return { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
  }

  getAllOrders(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeader() });
  }

  getMyOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-orders`, { headers: this.getAuthHeader() });
  }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(this.apiUrl, orderData, { headers: this.getAuthHeader() });
  }

  updateOrderStatus(orderId: number, status: string, tracking: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/status`, { shipping_status: status, tracking_number: tracking }, { headers: this.getAuthHeader() });
  }
}
