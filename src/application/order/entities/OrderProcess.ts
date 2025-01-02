import { OrderItem } from './OrderItems';
import { OrderStatus } from './OrderStatus';

export class OrderProcess {
  items?: OrderItem[];
  customerId: string;
  total: number;
  status: OrderStatus;
  payment_id: string;

  constructor() {
    this.status = OrderStatus.Pending;
    this.total = 0;
    this.items = [];
  }
}
