import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { Product } from '../../models/product';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule,RouterModule]
})
export class HomeComponent implements OnInit {
  products = this.productService.products;
  allProducts: Product[] = [];
  cartItems: string[] = []; // Keep track of added items
  private _unSubscribe$: Subject<boolean> = new Subject();
  totalProducts: number = 0;
  currentPage: number = 1;
  productsPerPage: number = 3; // Control product per page count
  totalPages: number = 0;
  pages: number[] = [];
  selectedCategoryId: string | null = null; // To hold the selected category ID


  constructor(private productService: ProductsService, private cartSer: CartService) {}

  ngOnInit() {

    this.getAllProducts(this.currentPage);
      // Load cart items from localStorage
  this.loadCartItemsFromLocalStorage();
  }


  loadCartItemsFromLocalStorage() {
    const storedCartItems = localStorage.getItem('cartItems');
    this.cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
  }
  
  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const catId = selectElement.value;
    this.selectedCategoryId = catId === 'all' ? null : catId;
    this.currentPage = 1; // Reset to the first page when changing categories
    this.getAllProducts(this.currentPage, this.selectedCategoryId || undefined);
  }
  
  addToCart(productId: string) {
    // Check if the product is already in the cart
    if (!this.cartItems.includes(productId)) {
      this.cartSer.addItemToCart(productId).pipe(
        tap(() => {
          // Add to cartItems array when added to cart successfully
          this.cartItems.push(productId);
        }),
        takeUntil(this._unSubscribe$)
      ).subscribe();
    }
  }


  

  isAddedToCart(productId: string): boolean {
    // Check if the product is in the cart
    return this.cartItems.includes(productId);
  }


  

  getCategory(catId: string) {
    this.productService.getProductsByCatagory(catId).pipe(
      tap(res => {
        this.products.next(res.products);
        this.totalProducts = res.products.length;
        this.totalPages = Math.ceil(this.totalProducts / this.productsPerPage);
        this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1); // Create array for pagination buttons
        // console.log(res);
      }), 
      takeUntil(this._unSubscribe$)
    ).subscribe();
  }

  getAllProducts(page: number , catId?: string) {
    this.productService.getAllProducts(page , catId).pipe(
      tap(res => {
        this.products.next(res.products);
        this.totalProducts = res.totalPages;
        this.totalPages = Math.ceil(this.totalProducts / this.productsPerPage);
        this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1); // Create array for pagination buttons
        // console.log(res);
      }), 
      takeUntil(this._unSubscribe$)
    ).subscribe();
  }

  addToCard(itemId: string) {
    this.cartSer.addItemToCart(itemId).pipe(
      takeUntil(this._unSubscribe$)
    ).subscribe();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.getAllProducts(this.currentPage, this.selectedCategoryId || undefined);
  }

  ngOnDestroy(): void {
    this._unSubscribe$.next(true);
    this._unSubscribe$.complete();
  }
}
