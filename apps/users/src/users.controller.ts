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
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

import { UserData } from '@users/dto/user-data.dto'
import { Pagination } from '@users/dto/pagination'
import { CurrentUser } from '@users/decorators/current-user.decorator'
import { UsersService } from '@users/users.service'
import { sanitizeUser } from '@users/helpers/sanitize-user'
import { JwtAuthGuard } from '@users/guards/jwt-auth.guard'
import { UpdateUserRequest } from '@users/dto/update-user.request'
import { CreateUserRequest } from '@users/dto/create-user.request'
import { sanitizeUpdateUserRequest } from '@users/helpers/sanitize-update-user-request'
import { infinityPagination, RmqService, UserId } from '@app/common'

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

  @Patch()
  @ApiTags(apiTag)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserData })
  @UseGuards(JwtAuthGuard)
  update(@Body() request: UpdateUserRequest, @CurrentUser() userId: UserId) {
    return this.usersService
      .updateUser(userId, sanitizeUpdateUserRequest(request))
      .then(sanitizeUser)
  }

  @Delete()
  @ApiTags(apiTag)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Boolean })
  @UseGuards(JwtAuthGuard)
  delete(@CurrentUser() userId: UserId) {
    return this.usersService.deleteUser(userId)
  }

  @Get()
  @ApiTags(apiTag)
  @ApiOkResponse({ type: Pagination<UserData> })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 50 ? 50 : limit

    return infinityPagination(await this.usersService.getUsers({ page, limit }), {
      page,
      limit,
    })
  }

  @Get(':email')
  @ApiTags(apiTag)
  @ApiOkResponse({ type: UserData })
  findOne(@Param('email') email: string) {
    return this.usersService.getUser({ email }).then(sanitizeUser)
  }

  @EventPattern('project_created')
  handleProjectCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.usersService.log(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }

  @EventPattern('customer_created')
  handleustomerCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.usersService.log(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }

  @EventPattern('user_created')
  handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.usersService.log(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }
}

