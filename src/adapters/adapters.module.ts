import { Module } from '@nestjs/common';
import { OrderModule } from '../drivers/order/order.module';

@Module({
  imports: [OrderModule],
})
export class AdaptersModule {}
