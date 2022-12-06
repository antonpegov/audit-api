import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'

import { Project } from '@projects/schemas/project.schema'
import { ProjectsRepository } from '@projects/projects.repository'
import { CreateProjectRequest } from '@projects/dto/create-project.request'
import { AUDITORS_SERVICE, USERS_SERVICE } from '@projects/constants/services'

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name)

  constructor(
    private readonly projectsRepository: ProjectsRepository,
    @Inject(USERS_SERVICE) private usersClient: ClientProxy,
    @Inject(AUDITORS_SERVICE) private auditorsClient: ClientProxy,
  ) {}

  async createProject(request: CreateProjectRequest, ownerId: string): Promise<Project> {
    if (await this.projectsRepository.findOneOrReturnNull({ ownerId })) {
      throw new BadRequestException('You already have a project')
    }

    const session = await this.projectsRepository.startTransaction()
    Logger.log('Creating project for user with id = ' + ownerId)

    try {
      const project = await this.projectsRepository.create(
        { ...request, startDate: new Date(), ownerId },
        { session },
      )

      await lastValueFrom(
        this.auditorsClient.emit('project_created', {
          request,
        }),
      )
      await lastValueFrom(
        this.usersClient.emit('project_created', {
          request,
        }),
      )

      await session.commitTransaction()

      return project
    } catch (err) {
      await session.abortTransaction()
      throw err
    }
  }

  getProjects(): Promise<Project[]> {
    return this.projectsRepository.find({})
  }

  greetService(data: any) {
    this.logger.log(data)
  }
}

