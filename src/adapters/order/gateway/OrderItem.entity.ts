import { OrderEntity } from './Order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'itens_pedidos' })
export class OrderItemEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'quantidade', nullable: false })
  quantidade: number;

  @Column({
    name: 'preco_venda',
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precoVenda: number;

  @ManyToOne(() => OrderEntity, (order) => order.itemsOrder, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'pedidoId' })
  order: OrderEntity;

  @Column({ name: 'produtoId' })
  product: number;
}
