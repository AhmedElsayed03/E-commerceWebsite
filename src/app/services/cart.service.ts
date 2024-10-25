import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product, ProductsResponse } from '../models/product';
import { CartItem, CartResponse } from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems$: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  baseUrl = 'https://localhost:7244/api/CartItem/';
  cartUrl =
    'https://localhost:7244/api/Cart/EA83A2E4-7EFB-4078-87D0-1ABD38E00198';

  constructor(private http: HttpClient) {}

  getAllCartItems(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.cartUrl);
  }

  addItemToCart(id: string) {
    let params = new HttpParams()
      .append('productId', id)
      .append('cartId', 'EA83A2E4-7EFB-4078-87D0-1ABD38E00198');
  
    return this.http.post(this.baseUrl + 'Add-Item', "", { params }).pipe(
      tap(() => {
        // Store the item in localStorage when added
        this.saveCartItemToLocalStorage(id);
      })
    );
  }

  removeCartItemFromLocalStorage(productId: string) {
    // Get the current cart items from localStorage
    const storedCartItems = localStorage.getItem('cartItems');
    let cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
  
    // Remove the item from the array
    cartItems = cartItems.filter((id: string) => id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  saveCartItemToLocalStorage(productId: string) {
    // Get the current cart items from localStorage
    const storedCartItems = localStorage.getItem('cartItems');
    let cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
  
    // Add the new item to the array if it doesn't exist
    if (!cartItems.includes(productId)) {
      cartItems.push(productId);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }
  

  plusCount(id: string) {
    let params = new HttpParams()
      .append('productId', id)
      .append('cartId', 'EA83A2E4-7EFB-4078-87D0-1ABD38E00198');
    return this.http.post(this.baseUrl + 'Plus-Count', "", { params });
  }

  minusCount(id: string) {
    let params = new HttpParams()
      .append('productId', id)
      .append('cartId', 'EA83A2E4-7EFB-4078-87D0-1ABD38E00198');
    return this.http.post(this.baseUrl + 'Minus-Count', "", { params });
  }

  deleteItem(id: string) {
    let params = new HttpParams()
      .append('productId', id)
      .append('cartId', 'EA83A2E4-7EFB-4078-87D0-1ABD38E00198');
    return this.http.delete(this.baseUrl + 'Delete', { params }); // Use baseUrl with 'Delete'
  }
}
