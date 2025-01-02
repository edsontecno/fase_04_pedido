import { Product } from '../../application/product/entities/Product';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ProductUseCase {
  constructor(private configService: ConfigService) {}

  async getProductById(id: number) {
    const response = await axios.get(
      `${this.configService.get('URL_DOMINIO')}/product/${id}`,
    );
    return this.convertResultToEntity(response.data);
  }

  private convertResultToEntity(result: any): Product {
    if (!result) {
      return null;
    }
    const product = new Product();
    Object.assign(product, result);

    return product;
  }
}
