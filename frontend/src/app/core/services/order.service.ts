import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
} from '../../models';

@Injectable({ providedIn: 'root' })
export class OrderService {

  //backend url/port
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //http obesrvables for http api requests  

  createOrder(payload: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(`${this.base}/orders`, payload);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/orders`);
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.base}/orders/${orderId}`);
  }

  captureOrder(orderId: string): Observable<any> {
    return this.http.post<any>(`${this.base}/payments/capture/${orderId}`, {});
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.http.post<any>(`${this.base}/payments/cancel/${orderId}`, {});
  }

  refundOrder(orderId: string, amount?: number): Observable<any> {
    const body = amount != null ? { amount } : {};
    return this.http.post<any>(`${this.base}/payments/refund/${orderId}`, body);
  }
}