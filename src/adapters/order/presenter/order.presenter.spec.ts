import { Order } from '../../../application/order/entities/Order';
import { OrderItem } from '../../../application/order/entities/OrderItems';
import { ResponseOrderDTO } from '../dto/response-order.dto';
import { OrderStatus } from '../../../application/order/entities/OrderStatus';
import { OrderPresenter } from './OrderPresenter';

describe('OrderPresenter', () => {
  let presenter: OrderPresenter;

  beforeEach(() => {
    presenter = new OrderPresenter();
  });

  describe('convertEntityToResponseDto', () => {
    it('should convert an Order entity to ResponseOrderDTO', () => {
      const order = new Order();
      order.id = 1;
      order.total = 100;
      order.status = OrderStatus.Pending;
      order.awaitTime = '10 minutes';
      order.items = [
        { amount: 2, salePrice: 50, productName: 'Product A' } as OrderItem,
      ];

      const result = presenter.convertEntityToResponseDto(order);

      expect(result).toBeInstanceOf(ResponseOrderDTO);
      expect(result.id).toBe(order.id);
      expect(result.total).toBe(order.total);
      expect(result.status).toBe(order.status);
      expect(result.awaitTime).toBe(order.awaitTime);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({
        amount: 2,
        price: 50,
        product: 'Product A',
      });
    });

    it('should handle an Order entity with no items', () => {
      const order = new Order();
      order.id = 1;
      order.total = 100;
      order.status = OrderStatus.Pending;
      order.awaitTime = '10 minutes';
      order.items = null;

      const result = presenter.convertEntityToResponseDto(order);

      expect(result).toBeInstanceOf(ResponseOrderDTO);
      expect(result.items).toHaveLength(0);
    });
  });

  describe('convertArrayEntityToArrayResponseDto', () => {
    it('should convert an array of Order entities to an array of ResponseOrderDTO', () => {
      const orders = [
        {
          id: 1,
          total: 100,
          status: 'Pending',
          awaitTime: '10 minutes',
          items: [
            { amount: 2, salePrice: 50, productName: 'Product A' } as OrderItem,
          ],
        },
        {
          id: 2,
          total: 200,
          status: 'Completed',
          awaitTime: '5 minutes',
          items: [
            {
              amount: 1,
              salePrice: 200,
              productName: 'Product B',
            } as OrderItem,
          ],
        },
      ];

      const result = presenter.convertArrayEntityToArrayResponseDto(
        orders as Order[],
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(ResponseOrderDTO);
      expect(result[0].id).toBe(1);
      expect(result[0].items).toHaveLength(1);
      expect(result[1]).toBeInstanceOf(ResponseOrderDTO);
      expect(result[1].id).toBe(2);
      expect(result[1].items).toHaveLength(1);
    });

    it('should return an empty array if the input is empty', () => {
      const result = presenter.convertArrayEntityToArrayResponseDto([]);

      expect(result).toHaveLength(0);
    });
  });

  describe('returnIdOfEntity', () => {
    it('should return the ID of an Order entity', () => {
      const order = new Order();
      order.id = 1;

      const result = presenter.returnIdOfEntity(order);

      expect(result).toBe(1);
    });
  });
});
