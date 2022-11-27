import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { Connection, Model } from 'mongoose'

import { AbstractRepository } from '@app/common'

import { Project } from '@projects/schemas/project.schema'

@Injectable()
export class ProjectsRepository extends AbstractRepository<Project> {
  protected readonly logger = new Logger(ProjectsRepository.name)

  constructor(
    @InjectModel(Project.name) model: Model<Project>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection)
  }
}

