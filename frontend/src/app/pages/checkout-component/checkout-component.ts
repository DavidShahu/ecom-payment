import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-component.html',
  styleUrl: './checkout-component.css',
})

export class CheckoutComponent {
  autoCapture = false;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    public router: Router
  ) {}

  placeOrder(): void {
    if (this.cartService.items().length === 0) return;

    this.loading.set(true);
    this.error.set(null);

    const payload = {
      items: this.cartService.items().map(i => ({
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      autoCapture: this.autoCapture,
      currency: 'ALL',
    };

    this.orderService.createOrder(payload).subscribe({
      next: (response) => {
        this.cartService.clearCart();
        if (response.checkoutUrl) {
          window.location.href = response.checkoutUrl;
        } else {
          this.router.navigate(['/orders', response.orderId]);
        }
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to create order. Please try again.');
        this.loading.set(false);
      }
    });
  }
}