import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from './constants/services';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async createOrder(request: CreateOrderDto, authentication: string) {
    const order = await this.ordersRepository.create(request);
    await lastValueFrom(
      this.billingClient.emit('order_created', {
        request,
        Authentication: authentication,
      }),
    );
    return order;
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }
}
