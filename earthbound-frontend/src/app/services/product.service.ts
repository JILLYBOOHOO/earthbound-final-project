import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3100/api/products';

  constructor(private http: HttpClient) { }

  getProducts(filters: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(this.apiUrl, product, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  updateProduct(id: number, product: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/${id}`, product, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  deleteProduct(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
}
