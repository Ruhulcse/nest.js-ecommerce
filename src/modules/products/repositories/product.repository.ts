import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.find({
      where: { categoryId },
      relations: ['category'],
    });
  }

  async searchByName(name: string): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .where('product.name ILIKE :name', { name: `%${name}%` })
      .getMany();
  }
}