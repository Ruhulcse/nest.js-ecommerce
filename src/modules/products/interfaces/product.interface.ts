export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}