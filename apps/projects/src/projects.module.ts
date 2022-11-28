import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import * as Joi from 'joi'

import { ProjectsService } from '@projects/projects.service'
import { AUDITORS_SERVICE } from '@projects/constants/services'
import { ProjectsController } from '@projects/projects.controller'
import { ProjectsRepository } from '@projects/projects.repository'
import { Project, ProjectSchema } from '@projects/schemas/project.schema'
import { DatabaseModule, RmqModule } from '@app/common'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_PROJECTS_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/projects/.env',
    }),
    RmqModule.register({
      name: AUDITORS_SERVICE,
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}

