import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Post, Body, Get } from '@nestjs/common'

import { User } from '@users/schemas/user.schema'
import { CreateUser } from '@users/dto/create-user.dto'
import { UsersService } from '@users/users.service'

const apiTag = 'users'

@Controller(apiTag)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}

