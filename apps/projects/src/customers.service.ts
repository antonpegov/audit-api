import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { FilterQuery } from 'mongoose'
import { ClientProxy } from '@nestjs/microservices'

import { Customer } from '@projects/schemas/customer.schema'
import { CustomersRepository } from '@projects/customers.repository'
import { CreateCustomerRequest } from '@projects/dto/create-customer.request'
import { AUDITORS_SERVICE, USERS_SERVICE } from '@projects/constants/services'

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name)

  constructor(
    private readonly customersRepository: CustomersRepository,
    @Inject(USERS_SERVICE) private usersClient: ClientProxy,
    @Inject(AUDITORS_SERVICE) private auditorsClient: ClientProxy,
  ) {}

  async createCustomer(
    request: CreateCustomerRequest,
    userId: string,
  ): Promise<Customer> {
    if (await this.customersRepository.findOneOrReturnNull({ userId })) {
      throw new BadRequestException('You already have a customer account')
    }

    const session = await this.customersRepository.startTransaction()

    try {
      const customer = await this.customersRepository.create(
        { ...request, createdAt: new Date(), updatedAt: new Date(), userId },
        { session },
      )

      await lastValueFrom(
        this.auditorsClient.emit('customer_created', {
          request,
        }),
      )
      await lastValueFrom(
        this.usersClient.emit('customer_created', {
          request,
        }),
      )

      await session.commitTransaction()

      return customer
    } catch (err) {
      await session.abortTransaction()
      throw err
    }
  }

  async getCustomer(getCustomerArgs: FilterQuery<Customer>): Promise<Customer> {
    return this.customersRepository.findOne(getCustomerArgs)
  }

  async updateCustomer(
    userId: string,
    request: CreateCustomerRequest,
  ): Promise<Customer> {
    return this.customersRepository.findOneAndUpdate(
      { userId },
      {
        ...request,
        updatedAt: new Date(),
      },
    )
  }

  async deleteCustomer(userId: string): Promise<true> {
    return this.customersRepository.delete({ userId }).then(() => true)
  }

  getCustomers(): Promise<Customer[]> {
    return this.customersRepository.find({})
  }

  greetService(data: any) {
    this.logger.log(data)
  }
}

