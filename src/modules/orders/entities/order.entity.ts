import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

@Entity('orders')
export class Order extends BaseEntity {
  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column({ type: 'jsonb' })
  items: Array<{ productId: string; quantity: number }>;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;
}