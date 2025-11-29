export interface Sneaker {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  color: string;
  releaseYear: number;
  sizes: number[];           
  inStock: boolean;
}
