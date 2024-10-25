import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ViewSingleProductComponent } from './components/view-single-product/view-single-product.component';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    
    {
        path: 'products/all',
        title: 'All Products',
        component: ProductsListComponent
    },
    {
        path: 'product-details/:id',
        component: ViewSingleProductComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'notFound',
        component: NotFoundComponent
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
