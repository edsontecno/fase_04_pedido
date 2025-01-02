import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from './../../../application/order/entities/OrderStatus';
import { OrderItemEntity } from './OrderItem.entity';

@Entity({ name: 'pedidos' })
export class OrderEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'total',
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total: number;

  @Column({ name: 'clienteId', nullable: true })
  customer: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @OneToMany(() => OrderItemEntity, (itemOrder) => itemOrder.order, {
    cascade: true,
    nullable: true,
  })
  itemsOrder: OrderItemEntity[];

  @Column({ nullable: true })
  payment_id: string;
}
