import { OrderItemSearchDto } from './order-item-search.dto';

describe('OrderItemSearchDto', () => {
  it('should create an instance of OrderItemSearchDto', () => {
    const dto = new OrderItemSearchDto();
    dto.id = 1;
    dto.quantidade = 2;
    dto.precoVenda = 50;
    dto.productId = 101;

    expect(dto).toBeInstanceOf(OrderItemSearchDto);
    expect(dto.id).toBe(1);
    expect(dto.quantidade).toBe(2);
    expect(dto.precoVenda).toBe(50);
    expect(dto.productId).toBe(101);
  });
});
