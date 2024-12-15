import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<{ message: string; data: Category }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = this.categoryRepository.create(createCategoryDto);
      const savedCategory = await this.categoryRepository.save(category);
      
      await queryRunner.commitTransaction();

      return {
        message: "Successfully created category",
        data: savedCategory
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create category');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<{ message: string; data: { categories: Category[]; total: number } }> {
    try {
      const [categories, total] = await this.categoryRepository.findAndCount();
      
      return {
        message: "Successfully get category data",
        data: {
          categories,
          total
        }
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch categories');
    }
  }

  async findOne(id: string): Promise<{ message: string; data: Category }> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return {
        message: "Successfully get category detail",
        data: category
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch category');
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{ message: string; data: Category }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { data: category } = await this.findOne(id);

      Object.assign(category, updateCategoryDto);
      const updatedCategory = await this.categoryRepository.save(category);

      await queryRunner.commitTransaction();

      return {
        message: "Successfully updated category",
        data: updatedCategory
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update category');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.categoryRepository.delete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return {
        message: "Successfully deleted category"
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete category');
    }
  }
}