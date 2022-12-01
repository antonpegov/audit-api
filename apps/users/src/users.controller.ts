import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices'
import { Types } from 'mongoose'
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

import { User } from '@users/schemas/user.schema'
import { UsersService } from '@users/users.service'
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
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  create(@Body() request: CreateUserRequest) {
    return this.usersService.createUser(request)
  }

  @Get()
  @ApiTags(apiTag)
  @ApiOkResponse({ type: [User] })
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

  @Get(':id')
  @ApiTags(apiTag)
  @ApiOkResponse({
    description: 'The found record',
    type: User,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.getUser({ _id: new Types.ObjectId(id) })
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

