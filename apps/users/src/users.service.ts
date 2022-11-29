import { Inject, Injectable, Logger } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'

import { User } from '@users/schemas/user.schema'
import { CreateUser } from '@users/dto/create-user.dto'
import { UsersRepository } from '@users/users.repository'
import { AUDITORS_SERVICE, PROJECTS_SERVICE } from '@users/constants/services'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(PROJECTS_SERVICE) private projectsClient: ClientProxy,
    @Inject(AUDITORS_SERVICE) private auditorsClient: ClientProxy,
  ) {}

  async createUser(request: CreateUser): Promise<Omit<User, 'password'>> {
    const session = await this.usersRepository.startTransaction()

    try {
      const user = await this.usersRepository.create(request, { session })

      await lastValueFrom(
        this.projectsClient.emit('user_created', {
          request,
        }),
      )
      await lastValueFrom(
        this.auditorsClient.emit('user_created', {
          request,
        }),
      )
      this.logger.log(`'user_created' emitted`)
      await session.commitTransaction()
      return user
    } catch (err) {
      await session.abortTransaction()
      throw err
    }
  }

  getUsers(): Promise<User[]> {
    return this.usersRepository.find({}).then((users) => {
      users.forEach((user) => delete user.password)

      return users
    })
  }

  greetService(data: any) {
    console.log(data)
    this.logger.log(data)
  }
}

