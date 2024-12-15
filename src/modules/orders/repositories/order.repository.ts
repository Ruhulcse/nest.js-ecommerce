import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return this.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCustomerEmail(email: string): Promise<Order[]> {
    return this.find({
      where: { customerEmail: email },
      order: { createdAt: 'DESC' },
    });
  }
}