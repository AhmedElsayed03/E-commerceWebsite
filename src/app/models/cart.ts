import { Product } from './product';

export interface CartResponse {
    cartItems: CartItem[];
    totalPrice: number;
    isActive: boolean;
}

export interface CartItem {
    productDetailsReadDto: {
      productId:string;
      name: string;
      description: string;
      price: number;
      categoryId: string;
      category: string;
      imagesUrls: string[];
    };
    quantity: number;
    totalPrice: number;
  }
  