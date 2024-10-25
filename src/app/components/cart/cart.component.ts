import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { CartItem } from '../../models/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  _unSubscribe$ = new Subject<boolean>();
  allCartItems!: CartItem[];
  cartItems$ = this.cartService.cartItems$;
  itemTotalprice: number[] = [];
  itemsQuantity: any[] = [];
  totalPrice: number = 0;
  itemsNumber: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.getAllcartItems();
  }

  getAllcartItems() {
    this.cartService.getAllCartItems().pipe(
      tap(res => {
        this.itemsQuantity = res.cartItems.map(ele => ele.quantity);
        this.itemTotalprice = res.cartItems.map(ele => ele.totalPrice);
        this.calcTotalPrice();

        // Calculate the total number of items (itemsNumber)
        this.itemsNumber = this.itemsQuantity.reduce((acc, quantity) => acc + quantity, 0);

        this.cartItems$.next(res.cartItems);
      }),
      takeUntil(this._unSubscribe$)
    ).subscribe();
  }

  plusItemCount(itemId: string, index: number, price: number) {
    this.cartService.plusCount(itemId).pipe(
      tap(res => {
        // Increase the quantity of the specific item
        this.itemsQuantity[index] += 1;

        // Update the total price for this item
        this.itemTotalprice[index] = this.itemsQuantity[index] * price;

        // Recalculate the total price for the entire cart
        this.calcTotalPrice();

        // Recalculate the total number of items (itemsNumber)
        this.itemsNumber = this.itemsQuantity.reduce((acc, quantity) => acc + quantity, 0);
      }),
      takeUntil(this._unSubscribe$)
    ).subscribe();
  }

  minusItemCount(itemId: string, index: number, price: number) {
    this.cartService.minusCount(itemId).pipe(
      tap(res => {
        // Decrease the quantity of the specific item
        this.itemsQuantity[index] -= 1;

        // Ensure the quantity doesn't go below 1 (if that's your business rule)
        if (this.itemsQuantity[index] < 1) {
          this.itemsQuantity[index] = 1;
        }

        // Update the total price for this item
        this.itemTotalprice[index] = this.itemsQuantity[index] * price;

        // Recalculate the total price for the entire cart
        this.calcTotalPrice();

        // Recalculate the total number of items (itemsNumber)
        this.itemsNumber = this.itemsQuantity.reduce((acc, quantity) => acc + quantity, 0);
      }),
      takeUntil(this._unSubscribe$)
    ).subscribe();
  }
  
  calcTotalPrice() {
    this.totalPrice = Number(this.itemTotalprice.reduce((acc, price) => acc + price, 0).toFixed(2));
  }
  
  isCartEmpty(): boolean {
    const items = this.cartItems$.getValue();
    return !items || items.length === 0;
  }
  removeFromCart(productId: string) {
    this.cartService.deleteItem(productId).pipe(
      tap(() => {
        // Find the index of the item to remove
        const index = this.itemsQuantity.findIndex((_, i) => this.cartItems$.getValue()[i].productDetailsReadDto.productId === productId);
        if (index !== -1) {
          // Remove the item from the quantities and total prices arrays
          this.itemsQuantity.splice(index, 1);
          this.itemTotalprice.splice(index, 1);
  
          // Update the cartItems$ observable to reflect changes
          const updatedCartItems = this.cartItems$.getValue().filter((_, i) => i !== index);
          this.cartService.cartItems$.next(updatedCartItems);
  
          // Remove the item from localStorage
          this.cartService.removeCartItemFromLocalStorage(productId);
  
          // Recalculate the total price after the removal
          this.calcTotalPrice();
  
          // Recalculate the total number of items (itemsNumber)
          this.itemsNumber = this.itemsQuantity.reduce((acc, quantity) => acc + quantity, 0);
        }
      }),
      takeUntil(this._unSubscribe$)
    ).subscribe();
  }
  
  
  goToCheckout() {
    // Redirect to the checkout page or handle the checkout process
    console.log('Navigating to checkout...');
    // Example routing:
    // this.router.navigate(['/checkout']);
  }
  ngOnDestroy(): void {
    this._unSubscribe$.next(true);
    this._unSubscribe$.complete();
  }
}

