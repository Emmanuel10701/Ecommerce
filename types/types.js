// types.ts

export interface FilterState {
    price: string;
    keywords: {
      Expensive: boolean;
      'On Sale': boolean;
      'New Arrival': boolean;
      Trending: boolean;
      Popular: boolean;
    };
  }
  
  export interface Product {
    id: number;
    title: string;
    price: number;
    oldPrice?: number;
    image: string;
    description: string;
    keywords: string[];
    rating?: number;
  }
  
  export interface ProductsPageProps {
    filters: FilterState;
  }
  
  export interface ImageData {
    src: string;
    text: string;
  }
  