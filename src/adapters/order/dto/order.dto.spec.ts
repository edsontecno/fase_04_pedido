import { OrderDto } from './order.dto';
import { OrderItemDto } from './order-item.dto';

describe('OrderDto', () => {
  it('should create an instance of OrderDto', () => {
    const dto = new OrderDto();
    dto.id = 1;
    dto.total = 100;
    dto.status = 'Pending';
    dto.createdAt = '2023-01-01T10:00:00Z';
    dto.updatedAt = '2023-01-01T11:00:00Z';
    dto.itemsOrder = [
      {
        id: 1,
        quantidade: 2,
        precoVenda: 50,
        productId: 101,
      } as unknown as OrderItemDto,
    ];
    dto.customer = 'John Doe';

    expect(dto).toBeInstanceOf(OrderDto);
    expect(dto.id).toBe(1);
    expect(dto.total).toBe(100);
    expect(dto.status).toBe('Pending');
    expect(dto.createdAt).toBe('2023-01-01T10:00:00Z');
    expect(dto.updatedAt).toBe('2023-01-01T11:00:00Z');
    expect(dto.itemsOrder).toHaveLength(1);
    expect(dto.itemsOrder[0].productId).toBe(101);
    expect(dto.customer).toBe('John Doe');
  });
});
