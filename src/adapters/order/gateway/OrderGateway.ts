// import { getEnumFromString as getStatusPayment } from './../../payment/gateway/PaymentStatus';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../../application/order/entities/Order';
import { OrderProcess } from '../../../application/order/entities/OrderProcess';
import { IOrderData } from '../../../application/order/interfaces/IOrderData';
import { Repository } from 'typeorm';
import {
  getEnumFromString,
  OrderStatus,
} from './../../../application/order/entities/OrderStatus';
import { OrderEntity } from './Order.entity';
import { OrderItemEntity } from './OrderItem.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderItem } from '../../../application/order/entities/OrderItems';
import { BusinessRuleException } from '../../../system/filtros/business-rule-exception';

export class OrderGateway implements IOrderData {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {}

  async save(order: OrderProcess): Promise<Order> {
    let entity = new OrderEntity();
    entity.customer = order.customerId;
    entity.itemsOrder = [];
    order.items.forEach((element) => {
      const itemOrder = new OrderItemEntity();
      itemOrder.product = element.productId;
      itemOrder.quantidade = element.amount;
      itemOrder.precoVenda = element.salePrice;
      entity.itemsOrder.push(itemOrder);
    });
    Object.assign(entity, order);
    entity = await this.repository.save(entity);

    return this.convertDataToEntity(entity);
  }

  // async changeOrderStatus(id: number, status: OrderStatus) {
  //   const order = await this.repository.findOneBy({ id });
  //   order.status = status;
  //   await this.repository.save(order);
  // }

  async getAllByStatus(status: OrderStatus): Promise<Order[]> {
    const ordersEntity = await this.repository.find({
      where: { status },
      relations: ['itemsOrder', 'customer', 'itemsOrder.product'],
    });
    const orders = [];
    for (const entity of ordersEntity) {
      orders.push(this.convertDataToEntity(entity));
    }
    return orders;
  }
  async changeStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.repository.findOneBy({ id });
    order.status = status;
    await this.repository.save(order);
    return this.convertDataToEntity(order);
  }

  async getOrdersByCustomer(cpf: string): Promise<Order[]> {
    const ordersEntity = await this.repository.find({
      where: {
        customer: cpf,
      },
      relations: ['itemsOrder', 'customer', 'itemsOrder.product'],
    });
    const orders: Order[] = [];
    for (const item of ordersEntity) {
      orders.push(this.convertDataToEntity(item));
    }
    return orders;
  }

  async get(id: number): Promise<Order> {
    const entity = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['itemsOrder'],
    });
    if (entity === null) {
      throw new BusinessRuleException('Pedido não localizado');
    }
    const order = this.convertDataToEntity(entity);
    console.log(order);
    return order;
  }

  async getOrders(status: OrderStatus[]): Promise<Order[]> {
    const ordersEntity = await this.repository
      .createQueryBuilder('pedido')
      .where('pedido.status IN (:...statuses)', {
        statuses: status,
      })
      .orderBy(
        `CASE 
          WHEN pedido.status = 'pronto' THEN 1
          WHEN pedido.status = 'em preparação' THEN 2
          WHEN pedido.status = 'recebido' THEN 3
          WHEN pedido.status = 'pendente' THEN 4
          WHEN pedido.status = 'finalizado' THEN 5
          WHEN pedido.status = 'cancelado' THEN 6
          ELSE 7
        END`,
        'ASC',
      )
      .addOrderBy('pedido.createdAt', 'ASC')
      .getMany();

    const orders: Order[] = [];
    for (const item of ordersEntity) {
      // const newOrder = new Order();
      // Object.assign(newOrder, item);
      orders.push(this.convertDataToEntity(item));
    }
    return orders;
  }

  convertDtoToEntity(dto: CreateOrderDto): Order {
    const order = new Order();
    order.items = [];
    Object.assign(order.items, dto.items);
    order.customerId = dto.customer;
    return order;
  }

  convertDataToEntity(data: OrderEntity): Order {
    const order = new Order();
    order.id = data.id;
    order.createdAt = data.createdAt;
    order.status = getEnumFromString(data.status);
    order.total = data.total;
    const items: OrderItem[] = [];
    if (data.itemsOrder) {
      data.itemsOrder.forEach((item) => {
        const newOrderItem = new OrderItem();
        newOrderItem.salePrice = item.precoVenda;
        newOrderItem.productId = item.product;
        items.push(newOrderItem);
      });
      order.items = items;
    }
    order.payment_id = data.payment_id;

    return order;
  }

  async updateStatusPayment(
    payment_id: string,
    status: string,
  ): Promise<Order> {
    const order = await this.repository.findOne({
      where: { payment_id },
    });

    if (order) {
      order.status = OrderStatus.Canceled;

      if (status === 'approved') {
        order.status = OrderStatus.Received;
      }

      await this.repository.save(order);
      return this.convertDataToEntity(order);
    }
  }
}
