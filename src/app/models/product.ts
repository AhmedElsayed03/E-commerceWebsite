export interface Product{
    productId:string,
    name:string,
    description: string,
    price: number,
    categoryId: string,
    category: string,
    imagesUrls:string[]
}

export interface ProductsResponse{
    products:Product[],
    totalPages:number
}
export interface CategoryProducts {
  products: Product[]; // Array of products
  totalPages: number;  // Total pages for the category  
  }
  export interface CategoriesRes {
    id:string
    name: string;
   
  }
  