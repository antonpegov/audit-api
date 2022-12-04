import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices'
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common'

import { UserData } from '@users/dto/user-data.dto'
import { UsersService } from '@users/users.service'
import { sanitizeUser } from '@users/helpers/sanitize-user'
import { CreateUserRequest } from '@users/dto/create-user.request'
import { infinityPagination, RmqService } from '@app/common'

const apiTag = 'users'
@Controller(apiTag)
export class UsersController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiTags(apiTag)
  @ApiCreatedResponse({ type: UserData })
  create(@Body() request: CreateUserRequest) {
    return this.usersService.createUser(request).then(sanitizeUser)
  }

  @Get()
  @ApiTags(apiTag)
  @ApiOkResponse({ type: [UserData] })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    if (limit > 50) {
      limit = 50
    }

    return infinityPagination(
      await this.usersService.getUsers({
        page,
        limit,
      }),
      { page, limit },
    )
  }

  @Get(':email')
  @ApiTags(apiTag)
  @ApiOkResponse({ type: UserData })
  findOne(@Param('email') email: string) {
    return this.usersService.getUser({ email }).then(sanitizeUser)
  }

  @EventPattern('project_created')
  async handleProjectCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.usersService.log(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }

  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.usersService.log(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }
}
