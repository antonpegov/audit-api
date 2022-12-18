import { lastValueFrom } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'
import * as bcrypt from 'bcrypt'
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common'

import { UserData } from '@users/dto/user-data.dto'
import { sanitizeUser } from '@users/helpers/sanitize-user'
import { UsersRepository } from '@users/users.repository'
import { CreateUserRequest } from '@users/dto/create-user.request'
import { PaginationOptions, UserId } from '@app/common'
import { UpdateUserRequest } from '@users/dto/update-user.request'
import { User, UserRole, UserStatus } from '@users/schemas/user.schema'
import { AUDITORS_SERVICE, PROJECTS_SERVICE } from '@users/constants/services'
import { FilterQuery } from 'mongoose'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(PROJECTS_SERVICE) private projectsClient: ClientProxy,
    @Inject(AUDITORS_SERVICE) private auditorsClient: ClientProxy,
  ) {}

  async createUser(request: CreateUserRequest): Promise<User> {
    let session, user

    session = await this.usersRepository.startTransaction()

    try {
      user = await this.usersRepository.create({
        ...request,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: UserStatus.NEW,
        password: await bcrypt.hash(request.password, 10),
      })

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
      await session.commitTransaction()
      return user
    } catch (err) {
      await session.abortTransaction()
      throw err
    }
  }

  async updateUser(userId: UserId, request: UpdateUserRequest): Promise<User> {
    return this.usersRepository.findOneAndUpdate(
      { _id: userId },
      {
        ...request,
        updatedAt: new Date(),
        // password: request.password
        //   ? await bcrypt.hash(request.password, 10)
        //   : user.password,
      },
    )
  }

  async deleteUser(userId: UserId): Promise<true> {
    return this.usersRepository.delete({ _id: userId }).then(() => true)
  }

  async getUsers(options: PaginationOptions): Promise<UserData[]> {
    return this.usersRepository
      .find({
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      })
      .then((users) => users.map(sanitizeUser))
  }

  async getUser(getUserArgs: FilterQuery<User>): Promise<User> {
    return this.usersRepository.findOne(getUserArgs)
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersRepository.findOneOrReturnNull({ email })

      if (!user) throw 'Credentials are not valid'

      const passwordIsValid = await bcrypt.compare(password, user.password)

      if (!passwordIsValid) throw 'Credentials are not valid'

      return user
    } catch (e) {
      throw new UnauthorizedException(e)
    }
  }

  log(data: any) {
    this.logger.log(data)
  }
}

