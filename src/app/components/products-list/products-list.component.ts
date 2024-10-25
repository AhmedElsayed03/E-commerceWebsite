import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { CategoriesRes, Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  imports: [CommonModule, RouterLink]
})
export class ProductsListComponent implements OnInit, OnDestroy {
  
  products = this.productService.products;
  allProducts: Product[] = [];
  allCategories: CategoriesRes[] = [];
  cartItems: string[] = []; // Keep track of added items
  private _unSubscribe$: Subject<boolean> = new Subject();
  totalProducts: number = 0;
  currentPage: number = 1;
  // productsPerPage: number = 3; // Control product per page count
  totalPages: number = 0;
  pages: number[] = [];
  selectedCategoryId: string | null = null; // To hold the selected category ID


  constructor(private productService: ProductsService, private cartSer: CartService) {}

  ngOnInit() {
    
    this.getAllCategories();
    this.getAllProducts(this.currentPage);
    
    this.loadCartItemsFromLocalStorage();
  }


  loadCartItemsFromLocalStorage() {
    const storedCartItems = localStorage.getItem('cartItems');
    this.cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
  }
  
  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const catId = selectElement.value;
  
    console.log(`Selected Category ID: ${catId}`); // Debugging line
    this.selectedCategoryId = catId === 'all' ? null : catId; // Set to null if 'all' is selected
    this.currentPage = 1; // Reset to the first page
  
    if (this.selectedCategoryId) {
      this.getAllProducts(this.currentPage, this.selectedCategoryId); // Fetch products for the selected category
    } else {
      this.getAllProducts(this.currentPage); // Fetch all products
    }
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
  
  
  
  addToCard(itemId: string) {
    this.cartSer.addItemToCart(itemId).pipe(
      takeUntil(this._unSubscribe$)
    ).subscribe();
  }

  isAddedToCart(productId: string): boolean {
    // Check if the product is in the cart
    return this.cartItems.includes(productId);
  }


  getAllCategories() {
    this.productService.getAllCatagories().pipe(
      tap((res) => {
        this.allCategories = res;
      }),
      takeUntil(this._unSubscribe$)
    ).subscribe();
  }

  getCategory(catId: string) {
    this.productService.getProductsByCatagory(catId).pipe(
        tap(res => {
            this.products.next(res.products);
            this.totalPages = res.totalPages; // Use totalPages from the response
            this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1); // Create pagination buttons
            // console.log(res);
        }),
        takeUntil(this._unSubscribe$)
    ).subscribe();
}


getAllProducts(page: number, catId?: string) {
  this.productService.getAllProducts(page, catId).pipe(
      tap(res => {
          console.log(res); // Check the response structure
          this.products.next(res.products);
          this.totalPages = res.totalPages; // Ensure this is being set correctly
          this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
      }),
      takeUntil(this._unSubscribe$)
  ).subscribe();
}




 changePage(page: number, catId: string | null) {
  this.currentPage = page;
  this.getAllProducts(this.currentPage, catId || undefined); // Pass catId if present, otherwise undefined
}


  ngOnDestroy(): void {
    this._unSubscribe$.next(true);
    this._unSubscribe$.complete();
  }
}
