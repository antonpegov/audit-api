import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Post, Body, Get } from '@nestjs/common'
import { RmqService } from '@app/common'

import { User } from '@users/schemas/user.schema'
import { CreateUser } from '@users/dto/create-user.dto'
import { UsersService } from '@users/users.service'
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices'

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
  create(@Body() request: CreateUser) {
    return this.usersService.createUser(request)
  }

  @Get()
  @ApiTags(apiTag)
  @ApiOkResponse({
    description: 'The records a successfully recieved.',
    type: [User],
  })
  find() {
    return this.usersService.getUsers()
  }

  @EventPattern('project_created')
  async handleProjectCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.usersService.greetService(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }

  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.usersService.greetService(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }
}

