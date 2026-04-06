import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  // krijon nje list of cart items that can me updated whene i add/remoce
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
 
  readonly total = computed(() =>
    this._items().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  readonly count = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  //shto produkt
  addToCart(product: Product): void {
    this._items.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  //remove product
  removeFromCart(productId: number): void {
    this._items.update(items => items.filter(i => i.product.id !== productId));
  }

  //ndrysho sasin
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this._items.update(items =>
      items.map(i => i.product.id === productId ? { ...i, quantity } : i)
    );
  }

  //heq te gjitha 
  clearCart(): void {
    this._items.set([]);
  }
}