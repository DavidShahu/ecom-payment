import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../models';


@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {

   orders = signal<Order[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  actionLoading = signal<string | null>(null);
  actionSuccess = signal<string | null>(null);
  actionError: Record<string, string> = {};
  refundAmounts: Record<string, number | undefined> = {};

  constructor(private orderService: OrderService, public router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.orderService.getOrders().subscribe({
      next: (orders) => { this.orders.set(orders.reverse()); this.loading.set(false); },
      error: () => { this.error.set('Failed to load orders'); this.loading.set(false); }
    });
  }

  capture(orderId: string): void {
    this.runAction(orderId, this.orderService.captureOrder(orderId));
  }

  cancel(orderId: string): void {
    this.runAction(orderId, this.orderService.cancelOrder(orderId));
  }

  refund(orderId: string, amount?: number): void {
    this.runAction(orderId, this.orderService.refundOrder(orderId, amount));
  }

  private runAction(orderId: string, obs: any): void {
    this.actionLoading.set(orderId);
    this.actionSuccess.set(null);
    this.actionError[orderId] = '';

    obs.subscribe({
      next: () => {
        this.actionLoading.set(null);
        this.actionSuccess.set(orderId);
        setTimeout(() => this.actionSuccess.set(null), 3000);
        this.loadOrders();
      },
      error: (err: any) => {
        this.actionLoading.set(null);
        this.actionError[orderId] = err.error?.error || 'Action failed';
      }
    });
  }

}
