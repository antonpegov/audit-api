import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'
import * as bcrypt from 'bcrypt'

import { User } from '@users/schemas/user.schema'
import { CreateUserRequest } from '@users/dto/create-user.request'
import { UsersRepository } from '@users/users.repository'
import { AUDITORS_SERVICE, PROJECTS_SERVICE } from '@users/constants/services'
import { PaginationOptions } from '@app/common'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(PROJECTS_SERVICE) private projectsClient: ClientProxy,
    @Inject(AUDITORS_SERVICE) private auditorsClient: ClientProxy,
  ) {}

  private async validateCreateUserRequest(request: CreateUserRequest) {
    let user: User
    try {
      user = await this.usersRepository.findOne({
        email: request.email,
      })
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Email already exists.')
    }
  }

  async createUser(request: CreateUserRequest): Promise<Omit<User, 'password'>> {
    let session, user

    await this.validateCreateUserRequest(request)
    session = await this.usersRepository.startTransaction()

    try {
      user = await this.usersRepository.create({
        ...request,
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

  async getUsers(
    paginationOptions: PaginationOptions,
  ): Promise<Omit<User, 'password'>[]> {
    return this.usersRepository
      .find({
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        take: paginationOptions.limit,
      })
      .then((users) => {
        users.forEach((user) => delete user.password)

        return users
      })
  }

  async getUser(getUserArgs: Partial<User>): Promise<User> {
    return this.usersRepository.findOne(getUserArgs).then((user) => {
      // delete user.password

      return user
    })
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email })
    const passwordIsValid = await bcrypt.compare(password, user.password)

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.')
    }
    return user
  }

  log(data: any) {
    this.logger.log(data)
  }
}

