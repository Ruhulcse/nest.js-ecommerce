import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  // Mock service implementation
  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description',
        stockQuantity: 100,
        categoryId: '1'
      };

      const expectedResult = { id: '1', ...createProductDto };
      mockProductsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createProductDto);
      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedResult = [
        { id: '1', name: 'Product 1', price: 99.99 },
        { id: '2', name: 'Product 2', price: 149.99 },
      ];
      const paginationDto = { limit: 10, offset: 0 };
      
      mockProductsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(paginationDto, 'category', 'search');
      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto, 'category', 'search');
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const expectedResult = { id: '1', name: 'Product 1', price: 99.99 };
      mockProductsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');
      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });
});
