import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../models';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-status-component.html',
  styleUrl: './order-status-component.css'
})             
export class OrderStatusComponent implements OnInit {
  order = signal<Order | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  private orderId!: string;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('id') ?? '';
      if (this.orderId) this.loadOrder();
    });
  }

  loadOrder(): void {
    this.loading.set(true);
    this.error.set(null);
    this.orderService.getOrder(this.orderId).subscribe({
      next: (o) => { this.order.set(o); this.loading.set(false); },
      error: (err) => {
        this.error.set(err.error?.error || 'Could not load order');
        this.loading.set(false);
      }
    });
  }

  statusIcon(status: string): string {
    const map: Record<string, string> = {
      PENDING: '⏳', AUTHORIZED: '🔐', CAPTURED: '✅',
      CANCELLED: '🚫', FAILED: '❌', REFUNDED: '↩️',
      PARTIALLY_REFUNDED: '↩️'
    };
    return map[status] ?? '❓';
  }

  statusTitle(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Payment Pending',
      AUTHORIZED: 'Payment Authorised',
      CAPTURED: 'Payment Captured',
      CANCELLED: 'Order Cancelled',
      FAILED: 'Payment Failed',
      REFUNDED: 'Fully Refunded',
      PARTIALLY_REFUNDED: 'Partially Refunded'
    };
    return map[status] ?? status;
  }

  statusDescription(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Awaiting payment from the customer.',
      AUTHORIZED: 'Funds are reserved. Awaiting capture.',
      CAPTURED: 'Payment successfully received.',
      CANCELLED: 'This order has been cancelled.',
      FAILED: 'The payment was not successful.',
      REFUNDED: 'The full amount has been refunded.',
      PARTIALLY_REFUNDED: 'A partial refund has been issued.'
    };
    return map[status] ?? '';
  }
}