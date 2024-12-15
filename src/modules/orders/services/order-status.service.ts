import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { OrderStatus } from '../enums/order-status.enum';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderStatusService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status as any; // Type assertion to bypass type mismatch between enums
    await this.orderRepository.save(order);
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.findByStatus(status);
  }
}