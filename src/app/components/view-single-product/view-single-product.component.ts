import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../models/product';
import { Subject, of, tap, takeUntil } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-view-single-product',
  standalone: true,
  templateUrl: './view-single-product.component.html',
  styleUrls: ['./view-single-product.component.css'],
  imports: [CommonModule]
})
export class ViewSingleProductComponent implements OnInit, OnDestroy {

  selectedImage: string = '';
  _id: string = '';
  product!: Product;
  cartItems: string[] = []; // Keep track of added items
  isLoading: boolean = true;
  private _unSubscribe = new Subject<boolean>();

  constructor(
    private productSer: ProductsService,
    private activatedRoute: ActivatedRoute,
    private cartSer: CartService,
    private router: Router // Inject Router
  ) {
    this.activatedRoute.params.subscribe(param => {
      this._id = param["id"];
    });
  }

  ngOnInit() {
    this.getProduct();
    this.loadCartItemsFromLocalStorage();
  }

  onThumbnailClick(image: string) {
    this.selectedImage = image;
  }

  loadCartItemsFromLocalStorage() {
    const storedCartItems = localStorage.getItem('cartItems');
    this.cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
  }

  getProduct() {
    this.productSer.getProductById(this._id).pipe(
      tap(res => {
        this.isLoading = false; // Set loading to false once data is received
        if (!res) {
          this.router.navigate(['/notFound']);
        } else {
          this.product = res;
          console.log(res);
        }
      }),
      takeUntil(this._unSubscribe)
    ).subscribe();
  }

  addToCart(productId: string) {
    // Check if the product is already in the cart
    if (!this.cartItems.includes(productId)) {
      this.cartSer.addItemToCart(productId).pipe(
        tap(() => {
          // Add to cartItems array when added to cart successfully
          this.cartItems.push(productId);
        }),
        takeUntil(this._unSubscribe)
      ).subscribe();
    }
  }

  isAddedToCart(productId: string): boolean {
    // Check if the product is in the cart
    return this.cartItems.includes(productId);
  }

  ngOnDestroy(): void {
    this._unSubscribe.next(true);
    this._unSubscribe.complete();
  }
}
