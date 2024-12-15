import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async findWithProducts(id: string): Promise<Category> {
    return this.findOne({
      where: { id },
      relations: ['products'],
    });
  }
}