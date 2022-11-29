import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { Connection, Model } from 'mongoose'

import { AbstractRepository } from '@app/common'

import { User } from '@users/schemas/user.schema'

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name)

  constructor(
    @InjectModel(User.name) model: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection)
  }
}

