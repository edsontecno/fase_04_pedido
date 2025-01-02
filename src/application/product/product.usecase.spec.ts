import { ProductUseCase } from './ProductUseCase';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Product } from '../../application/product/entities/Product';

jest.mock('axios');

describe('ProductUseCase', () => {
  let useCase: ProductUseCase;
  let configServiceMock: Partial<ConfigService>;

  beforeEach(() => {
    configServiceMock = {
      get: jest.fn(),
    };

    useCase = new ProductUseCase(configServiceMock as ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProductById', () => {
    it('should fetch and return a product entity by ID', async () => {
      const mockProductData = {
        id: 1,
        name: 'Product A',
        description: 'A test product',
        price: 100,
        category: 2,
      };

      const axiosGetMock = jest.spyOn(axios, 'get').mockResolvedValue({
        data: mockProductData,
      });

      (configServiceMock.get as jest.Mock).mockReturnValue('http://localhost');

      const result = await useCase.getProductById(1);

      expect(configServiceMock.get).toHaveBeenCalledWith('URL_DOMINIO');
      expect(axiosGetMock).toHaveBeenCalledWith('http://localhost/product/1');

      expect(result).toBeInstanceOf(Product);
      expect(result.id).toBe(mockProductData.id);
      expect(result.name).toBe(mockProductData.name);
      expect(result.price).toBe(mockProductData.price);
    });

    it('should return null if the product does not exist', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue({
        data: null,
      });

      (configServiceMock.get as jest.Mock).mockReturnValue('http://localhost');

      const result = await useCase.getProductById(1);

      expect(result).toBeNull();
    });

    it('should throw an error if the axios request fails', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('Request failed'));

      (configServiceMock.get as jest.Mock).mockReturnValue('http://localhost');

      await expect(useCase.getProductById(1)).rejects.toThrow('Request failed');
    });
  });

  describe('convertResultToEntity', () => {
    it('should convert a valid result into a Product entity', () => {
      const mockResult = {
        id: 1,
        name: 'Product A',
        description: 'A test product',
        price: 100,
        category: 2,
      };

      const result = (useCase as any).convertResultToEntity(mockResult);

      expect(result).toBeInstanceOf(Product);
      expect(result.id).toBe(mockResult.id);
      expect(result.name).toBe(mockResult.name);
      expect(result.price).toBe(mockResult.price);
    });

    it('should return null if the result is falsy', () => {
      const result = (useCase as any).convertResultToEntity(null);

      expect(result).toBeNull();
    });
  });
});
