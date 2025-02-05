import { OrderGateway } from './OrderGateway';
import { Repository } from 'typeorm';
import { OrderEntity } from './Order.entity';
import { OrderProcess } from '../../../application/order/entities/OrderProcess';
import { OrderStatus } from '../../../application/order/entities/OrderStatus';
import { BusinessRuleException } from '../../../system/filtros/business-rule-exception';

describe('OrderGateway', () => {
  let gateway: OrderGateway;
  let repositoryMock: Partial<Repository<OrderEntity>>;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
      }),
    };

    gateway = new OrderGateway(repositoryMock as Repository<OrderEntity>);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('save', () => {
    it('should save an order and return it', async () => {
      const orderProcess = new OrderProcess();
      orderProcess.customerId = '12345';
      orderProcess.items = [
        {
          productId: 1,
          amount: 2,
          salePrice: 20,
          productName: '',
        },
        {
          productId: 2,
          amount: 1,
          salePrice: 15,
          productName: '',
        },
      ];
      const savedEntity = new OrderEntity();
      savedEntity.id = 1;

      (repositoryMock.save as jest.Mock).mockResolvedValue(savedEntity);

      const result = await gateway.save(orderProcess);

      expect(repositoryMock.save).toHaveBeenCalledWith(expect.any(OrderEntity));
      expect(result.id).toBe(1);
    });
  });

  describe('get', () => {
    it('should return an order by ID', async () => {
      const entity = new OrderEntity();
      entity.id = 1;
      entity.status = 'pendente';

      (repositoryMock.findOne as jest.Mock).mockResolvedValue(entity);

      const result = await gateway.get(1);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['itemsOrder'],
      });
      expect(result.id).toBe(1);
    });

    it('should throw an error if the order is not found', async () => {
      (repositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(gateway.get(1)).rejects.toThrow(
        new BusinessRuleException('Pedido não localizado'),
      );
    });
  });

  describe('changeStatus', () => {
    it('should change the status of an order', async () => {
      const entity = new OrderEntity();
      entity.id = 1;
      entity.status = 'pendente';

      (repositoryMock.findOneBy as jest.Mock).mockResolvedValue(entity);

      const result = await gateway.changeStatus(1, OrderStatus.Ready);

      expect(repositoryMock.save).toHaveBeenCalledWith(entity);
      expect(result.status).toBe(OrderStatus.Ready);
    });
  });

  describe('getAllByStatus', () => {
    it('should return orders filtered by status', async () => {
      const entities = [
        { id: 1, status: 'pendente' },
        { id: 2, status: 'pendente' },
      ];

      (repositoryMock.find as jest.Mock).mockResolvedValue(entities);

      const result = await gateway.getAllByStatus(OrderStatus.Pending);

      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: { status: OrderStatus.Pending },
        relations: ['itemsOrder', 'customer', 'itemsOrder.product'],
      });
      expect(result).toHaveLength(2);
    });
  });

  describe('updateStatusPayment', () => {
    it('should update the payment status of an order', async () => {
      const entity = new OrderEntity();
      entity.id = 1;
      entity.payment_id = 'payment_123';
      entity.status = OrderStatus.Canceled;

      (repositoryMock.findOne as jest.Mock).mockResolvedValue(entity);

      const result = await gateway.updateStatusPayment(
        'payment_123',
        'approved',
      );

      expect(repositoryMock.save).toHaveBeenCalledWith(entity);
      expect(result.status).toBe(OrderStatus.Received);
    });
  });
});
