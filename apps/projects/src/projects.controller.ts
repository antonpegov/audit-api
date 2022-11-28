import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import { Controller, Post, Body, Get } from '@nestjs/common'
import { RmqService } from '@app/common'

import { Project } from '@projects/schemas/project.schema'
import { CreateProject } from '@projects/dto/create-project.dto'
import { ProjectsService } from '@projects/projects.service'

const apiTag = 'projects'

@Controller(apiTag)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly rmqService: RmqService,
  ) {}

  @Post()
  @ApiTags(apiTag)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Project,
  })
  create(@Body() request: CreateProject) {
    return this.projectsService.createProject(request)
  }

  @Get()
  @ApiTags(apiTag)
  @ApiOkResponse({
    description: 'The records a successfully recieved.',
    type: [Project],
  })
  find() {
    return this.projectsService.getProjects()
  }

  @EventPattern('auditor_created')
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.projectsService.greetNewAuditor(data)
    // remove the message from the queue
    this.rmqService.ack(context)
  }
}

