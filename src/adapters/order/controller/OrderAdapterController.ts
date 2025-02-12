import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../../../adapters/order/dto/create-order.dto';
import { IOrderData } from '../../../application/order/interfaces/IOrderData';
import { IOrderUseCase } from '../../../application/order/interfaces/IOrderUseCase';
import { OrderPresenter } from '../presenter/OrderPresenter';
import { ResponseOrderDTO } from '../dto/response-order.dto';

@Injectable()
export class OrderAdapterController {
  constructor(
    private readonly useCase: IOrderUseCase,
    private gateway: IOrderData,
    private presenter: OrderPresenter,
  ) {}

  async save(orderDto: CreateOrderDto): Promise<object> {
    const order = this.gateway.convertDtoToEntity(orderDto);
    const savedOrder = await this.useCase.save(order);
    return savedOrder;
  }

  async getAllByStatus(status: string) {
    const orders = await this.useCase.getAllByStatus(status);
    return this.presenter.convertArrayEntityToArrayResponseDto(orders);
  }

  async getOrderByCustomer(cpf: string) {
    const orders = await this.useCase.getOrderByCustomer(cpf);
    return this.presenter.convertArrayEntityToArrayResponseDto(orders);
  }

  async changeStatus(id: string, status: string): Promise<ResponseOrderDTO> {
    const order = await this.useCase.changeStatus(id, status);
    return this.presenter.convertEntityToResponseDto(order);
  }

  async getListStatus() {
    return await this.useCase.getListStatus();
  }

  async getById(id: number) {
    const order = await this.useCase.getById(id);
    return this.presenter.convertEntityToResponseDto(order);
  }

  async findStatusOrder(id: number) {
    const order = await this.useCase.getById(id);
    return order.status;
  }

  async getOrders() {
    const orders = await this.useCase.getOrders();
    return this.presenter.convertArrayEntityToArrayResponseDto(orders);
  }

  async updateStatusPayment(
    id: string,
    status: string,
  ): Promise<ResponseOrderDTO> {
    const order = await this.useCase.updateStatusPayment(id, status);
    return this.presenter.convertEntityToResponseDto(order);
  }
}
