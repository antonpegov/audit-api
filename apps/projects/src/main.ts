import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { RmqService } from '@app/common'
import { ProjectsModule } from '@projects/projects.module'

async function bootstrap() {
  const app = await NestFactory.create(ProjectsModule)
  const configService = app.get(ConfigService)
  const rmqService = app.get<RmqService>(RmqService)
  const globalPrefix = 'api'
  const port = configService.get('PORT')
  const config = new DocumentBuilder()
    .setTitle('Projects')
    .setDescription('Projects API')
    .setVersion('0.1')
    .addTag('projects')
    .build()

  app.setGlobalPrefix(globalPrefix)
  app.useGlobalPipes(new ValidationPipe())
  app.connectMicroservice(rmqService.getOptions('PROJECTS'))

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document)

  await app.startAllMicroservices()
  await app.listen(port)
}

bootstrap()

