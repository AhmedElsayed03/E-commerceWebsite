import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { CategoriesRes, CategoryProducts, Product, ProductsResponse } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products:BehaviorSubject<Product[]>=new BehaviorSubject<Product[]>([])
  mainUrl="https://localhost:7244/api/Products/"
  CatagoryUrl="https://localhost:7244/api/Categories/"

constructor( private http:HttpClient) {
 }


 getAllProducts(page:number ,catId?: string):Observable<ProductsResponse>
 {
   if(catId){
      console.log(this.mainUrl+"all/"+page + "?catId="+catId)
      return this.http.get<ProductsResponse>(this.mainUrl + "all/" + page + "?catId=" + catId);
   }
   return this.http.get<ProductsResponse>(this.mainUrl+"all/"+page)
 }

 
 getProductById(id: string): Observable<Product | null> {
  return this.http.get<Product>(this.mainUrl+id).pipe(
    // Handle 404 or other errors
    catchError(() => {
      return of(null); // Return null if product not found
    })
  );
}

 getProductsByCatagory(catId: string): Observable<CategoryProducts> {
   return this.http.get<CategoryProducts>(this.CatagoryUrl + catId);
}


 getAllCatagories():Observable<CategoriesRes[]>
 {
    return this.http.get<CategoriesRes[]>(this.CatagoryUrl)
 }

}
