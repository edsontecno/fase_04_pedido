import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderAdapterController } from 'src/adapters/order/controller/OrderAdapterController';
import { OrderGateway } from 'src/adapters/order/gateway/OrderGateway';
import { IOrderData } from 'src/application/order/interfaces/IOrderData';
import { IOrderUseCase } from 'src/application/order/interfaces/IOrderUseCase';
import { OrderUseCase } from 'src/application/order/useCases/OrderUseCase';
import { OrderEntity } from '../../adapters/order/gateway/Order.entity';
import { OrderItemEntity } from '../../adapters/order/gateway/OrderItem.entity';
import { OrderController } from './order.controller';
import { OrderPresenter } from 'src/adapters/order/presenter/OrderPresenter';
import { ProductUseCase } from 'src/application/product/ProductUseCase';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity])],
  controllers: [OrderController],
  providers: [
    {
      provide: OrderPresenter,
      useClass: OrderPresenter,
    },
    {
      provide: OrderAdapterController,
      useClass: OrderAdapterController,
    },
    {
      provide: IOrderData,
      useClass: OrderGateway,
    },
    {
      provide: IOrderUseCase,
      useClass: OrderUseCase,
    },
    {
      provide: ProductUseCase,
      useClass: ProductUseCase,
    },
  ],
  exports: [
    {
      provide: IOrderData,
      useClass: OrderGateway,
    },
    {
      provide: IOrderUseCase,
      useClass: OrderUseCase,
    },
  ],
})
export class OrderModule {}
