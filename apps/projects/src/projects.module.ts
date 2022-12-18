import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import * as Joi from 'joi'

import {
  AUDITORS_SERVICE,
  AUTH_SERVICE,
  USERS_SERVICE,
} from '@projects/constants/services'
import { ProjectsService } from '@projects/projects.service'
import { CustomersService } from '@projects/customers.service'
import { ProjectsController } from '@projects/projects.controller'
import { ProjectsRepository } from '@projects/projects.repository'
import { CustomersRepository } from '@projects/customers.repository'
import { CustomersController } from '@projects/customers.controller'
import { ProjectNameAvailable } from '@projects/validators/project-name-available'
import { Project, ProjectSchema } from '@projects/schemas/project.schema'
import { Customer, CustomerSchema } from '@projects/schemas/customer.schema'
import { DatabaseModule, RmqModule } from '@app/common'

const envFilePath =
  process.env.NODE_ENV === 'production' ? './.env.projects' : './apps/projects/.env'
@Module({
  imports: [
    DatabaseModule,
    RmqModule.register({
      name: AUDITORS_SERVICE,
    }),
    RmqModule.register({
      name: USERS_SERVICE,
    }),
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_USERS_QUEUE: Joi.string().required(),
        RABBIT_MQ_AUDITORS_QUEUE: Joi.string().required(),
        RABBIT_MQ_PROJECTS_QUEUE: Joi.string().required(),
      }),
      envFilePath,
    }),
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [ProjectsController, CustomersController],
  providers: [
    CustomersService,
    CustomersRepository,
    ProjectsService,
    ProjectsRepository,
    ProjectNameAvailable,
  ],
})
export class ProjectsModule {}

