import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
import { PaginationDto } from '../common/pagination.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private productsService: ProductsService,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<{ message: string; data: Order }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalPrice = 0;

      // Validate order items
      if (!createOrderDto.items?.length) {
        throw new BadRequestException('Order must contain at least one item');
      }

      // Calculate total price and check stock
      for (const item of createOrderDto.items) {
        const { data: product } = await this.productsService.findOne(item.productId);
        
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        if (item.quantity <= 0) {
          throw new BadRequestException(`Quantity must be greater than 0 for product ${item.productId}`);
        }

        totalPrice += product.price * item.quantity;
        await this.productsService.decrementStock(item.productId, item.quantity);
      }

      const order = this.orderRepository.create({
        ...createOrderDto,
        totalPrice,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();

      return {
        message: "Successfully created order",
        data: savedOrder
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new BadRequestException('Failed to create order: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<{ message: string; data: { orders: Order[]; total: number } }> {
    try {
      const [orders, total] = await this.orderRepository.findAndCount({
        skip: (paginationDto.page - 1) * paginationDto.limit,
        take: paginationDto.limit,
        order: { createdAt: 'DESC' },
       
      });

      return {
        message: "Successfully get order data",
        data: {
          orders,
          total
        }
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch orders: ' + error.message);
    }
  }

  async findOne(id: string): Promise<{ message: string; data: Order }> {
    try {
      const order = await this.orderRepository.findOne({ 
        where: { id },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return {
        message: "Successfully get order detail",
        data: order
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch order: ' + error.message);
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<{ message: string; data: Order }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { data: order } = await this.findOne(id);

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      if (updateOrderDto.status) {

        if (!Object.values(OrderStatus).includes(updateOrderDto.status)) {
          throw new BadRequestException('Invalid status');
        }
      }

      Object.assign(order, updateOrderDto);
      const updatedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();

      return {
        message: "Successfully updated order",
        data: updatedOrder
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new BadRequestException('Failed to update order: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }
}