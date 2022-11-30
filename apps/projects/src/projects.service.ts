import { Inject, Injectable, Logger } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'

import { Project } from '@projects/schemas/project.schema'
import { CreateProject } from '@projects/dto/create-project.dto'
import { ProjectsRepository } from '@projects/projects.repository'
import { AUDITORS_SERVICE, USERS_SERVICE } from '@projects/constants/services'

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name)

  constructor(
    private readonly projectsRepository: ProjectsRepository,
    @Inject(USERS_SERVICE) private usersClient: ClientProxy,
    @Inject(AUDITORS_SERVICE) private auditorsClient: ClientProxy,
  ) {}

  async createProject(request: CreateProject): Promise<Omit<Project, 'password'>> {
    const session = await this.projectsRepository.startTransaction()

    try {
      const project = await this.projectsRepository.create(request, { session })

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
      this.logger.log(`'project_created' emitted`)
      await session.commitTransaction()
      return project
    } catch (err) {
      await session.abortTransaction()
      throw err
    }
  }

  getProjects(): Promise<Project[]> {
    return this.projectsRepository.find({}).then((projects) => {
      projects.forEach((project) => delete project.password)

      return projects
    })
  }

  greetService(data: any) {
    this.logger.log(data)
  }
}

