import { Controller, Post, Body, Get, UseGuards, Delete, Patch } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

import { RmqService } from '@app/common'
import { CustomerData } from '@projects/dto/customer.data'
import { JwtAuthGuard } from '@projects/guards/jwt-auth.guard'
import { CurrentUserId } from '@app/common/utils/'
import { CustomersService } from '@projects/customers.service'
import { sanitizeCustomer } from '@projects/helpers/sanitize-customer'
import { CreateCustomerRequest } from '@projects/dto/create-customer.request'
import { sanitizeCreateCustomerRequest } from '@projects/helpers/sanitize-create-customer-request'

const apiTag = 'customers'

@Controller(apiTag)
export class CustomersController {
  constructor(
    private readonly projectsService: CustomersService,
    private readonly rmqService: RmqService,
  ) {}

  @Post()
  @ApiTags(apiTag)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: CustomerData })
  create(@Body() request: CreateCustomerRequest, @CurrentUserId() userId: string) {
    return this.projectsService.createCustomer(request, userId).then(sanitizeCustomer)
  }

  @Get()
  @ApiTags(apiTag)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CustomerData })
  findMy(@CurrentUserId() userId: string) {
    return this.projectsService.getCustomer({ userId }).then(sanitizeCustomer)
  }

  @Patch()
  @ApiTags(apiTag)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CustomerData })
  @UseGuards(JwtAuthGuard)
  update(@Body() request: CreateCustomerRequest, @CurrentUserId() userId: string) {
    return this.projectsService
      .updateCustomer(userId, sanitizeCreateCustomerRequest(request))
      .then(sanitizeCustomer)
  }

  @Delete()
  @ApiTags(apiTag)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Boolean })
  @UseGuards(JwtAuthGuard)
  delete(@CurrentUserId() userId: string) {
    return this.projectsService.deleteCustomer(userId)
  }

  // @Get(':_id')
  // @ApiTags(apiTag)
  // @ApiOkResponse({ type: CustomerData })
  // findOne(@Param('_id') _id: string) {
  //   return this.projectsService.getCustomer({ _id }).then(sanitizeCustomer)
  // }

  @EventPattern('auditor_created')
  async handleAuditorCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.projectsService.greetService(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }

  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.projectsService.greetService(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }
}

