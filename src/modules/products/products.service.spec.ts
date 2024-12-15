import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  // Mock model implementation
  const mockProductModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto = {
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description',
      };

      const expectedResult = { id: '1', ...createProductDto };
      mockProductModel.create.mockResolvedValue(expectedResult);

      const result = await service.create({
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description',
        stockQuantity: 100,
        categoryId: '1'
      });
      expect(result).toEqual(expectedResult);
      expect(mockProductModel.create).toHaveBeenCalledWith({
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description', 
        stockQuantity: 100,
        categoryId: '1'
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedResult = [
        { id: '1', name: 'Product 1', price: 99.99 },
        { id: '2', name: 'Product 2', price: 149.99 },
      ];
      
      const mockQuery = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(expectedResult),
      };

      mockProductModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result).toEqual(expectedResult);
      expect(mockProductModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const expectedResult = { id: '1', name: 'Product 1', price: 99.99 };
      mockProductModel.findById.mockResolvedValue(expectedResult);

      const result = await service.findOne('1');
      expect(result).toEqual(expectedResult);
      expect(mockProductModel.findById).toHaveBeenCalledWith('1');
    });
  });
});
