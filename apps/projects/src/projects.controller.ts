import { Controller, Post, Body, Get } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import { Project } from '@projects/schemas/project.schema'
import { CreateProject } from '@projects/dto/create-project.dto'
import { ProjectsService } from '@projects/projects.service'

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Project,
  })
  create(@Body() request: CreateProject) {
    return this.projectsService.createProject(request)
  }

  @Get()
  @ApiCreatedResponse({
    description: 'The records a successfully recieved.',
    type: Project,
  })
  find() {
    return this.projectsService.getProjects()
  }
}

