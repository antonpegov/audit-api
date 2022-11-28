import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Post, Body, Get } from '@nestjs/common'

import { Project } from '@projects/schemas/project.schema'
import { CreateProject } from '@projects/dto/create-project.dto'
import { ProjectsService } from '@projects/projects.service'

const apiTag = 'projects'

@Controller(apiTag)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

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
}

