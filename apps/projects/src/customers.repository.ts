import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { Connection, Model } from 'mongoose'

import { Customer } from '@projects/schemas/customer.schema'
import { AbstractRepository } from '@app/common'

@Injectable()
export class CustomersRepository extends AbstractRepository<Customer> {
  protected readonly logger = new Logger(CustomersRepository.name)

  constructor(
    @InjectModel(Customer.name) model: Model<Customer>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection)
  }
}

