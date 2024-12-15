import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<{ message: string; data: Product }> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);
    return {
      message: "Successfully created product",
      data: savedProduct
    };
  }

  async findAll(
    paginationDto: PaginationDto,
    category?: string,
    search?: string,
  ): Promise<{ message: string; data: { products: Product[]; total: number } }> {
    const query = this.productRepository.createQueryBuilder('product');

    if (category) {
      query.andWhere('product.categoryId = :category', { category });
    }

    if (search) {
      query.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }
  
    const [products, total] = await query
      .skip((paginationDto.page - 1) * paginationDto.limit)
      .take(paginationDto.limit)
      .getManyAndCount();

    return {
      message: "Successfully get product data",
      data: {
        products,
        total
      }
    };
  }

  async findOne(id: string): Promise<{ message: string; data: Product }> {
    const product = await this.productRepository.findOne({ 
      where: { id },
      relations: ['category']
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return {
      message: "Successfully get product detail",
      data: product
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<{ message: string; data: Product }> {
    const product = await this.findOne(id);
    Object.assign(product.data, updateProductDto);
    const updatedProduct = await this.productRepository.save(product.data);
    return {
      message: "Successfully updated product",
      data: updatedProduct
    };
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return {
      message: "Successfully deleted product"
    };
  }

  async decrementStock(id: string, quantity: number): Promise<{ message: string; data: Product }> {
    const product = await this.findOne(id);
    if (product.data.stockQuantity < quantity) {
      throw new Error(`Insufficient stock for product ${product.data.name}`);
    }
    product.data.stockQuantity -= quantity;
    const updatedProduct = await this.productRepository.save(product.data);
    return {
      message: "Successfully updated product stock",
      data: updatedProduct
    };
  }
}