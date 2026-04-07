import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class ProductsComponent  {

  products: Product[] = [
    { id: 1, name: 'Wireless Headphones', description: 'Premium sound with noise cancellation', price: 4500, emoji: '🎧' },
    { id: 2, name: 'Mechanical Keyboard', description: 'RGB backlit, tactile switches', price: 8900, emoji: '⌨️' },
    { id: 3, name: 'Smartwatch Pro', description: 'Heart rate, GPS, 7-day battery', price: 12000, emoji: '⌚' },
    { id: 4, name: 'USB-C Hub', description: '7-in-1 multiport adapter', price: 2800, emoji: '🔌' },
    { id: 5, name: 'Webcam 4K', description: 'Wide angle, built-in mic', price: 6500, emoji: '📷' },
    { id: 7, name: 'Desk Lamp LED', description: 'Adjustable brightness & colour temp', price: 1900, emoji: '💡' },
    { id: 6, name: 'Macbook Pro', description: 'Apple Laptop', price: 190000, emoji: '💻' },
    { id: 8, name: 'Iphone 17 Pro Max', description: 'Most Powerfull Iphone Yet', price: 160000, emoji: '📱' },
    { id: 9, name: 'Samsung Galaxy S26 Ultra', description: 'Powered by GalaxyAI', price: 150000, emoji: '📱' },
  ];

constructor(public cartService: CartService, private router: Router, private route: ActivatedRoute) {
  // Handle redirect back from POK Pay
  this.route.queryParams.subscribe(params => {
    if (params['orderId']) {
      this.router.navigate(['/orders', params['orderId']]);
    }
  });
}
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

}
