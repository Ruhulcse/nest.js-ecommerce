import { Injectable } from '@nestjs/common';
import { ProductsService } from '../../products/products.service';
import { OrderItem } from '../interfaces/order.interface';

@Injectable()
export class OrderCalculationService {
  constructor(private readonly productsService: ProductsService) {}

  async calculateTotalPrice(items: OrderItem[]): Promise<number> {
    let totalPrice = 0;
    
    for (const item of items) {
      const product = await this.productsService.findOne(item.productId);
      totalPrice += product.data.price * item.quantity;
    }
    
    return totalPrice;
  }

  async validateStock(items: OrderItem[]): Promise<void> {
    for (const item of items) {
      const product = await this.productsService.findOne(item.productId);
      if (product.data.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.data.name}`);
      }
    }
  }
}