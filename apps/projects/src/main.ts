import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as YAML from 'json-to-pretty-yaml'
import * as fs from 'fs'

import { RmqService } from '@app/common'
import { ProjectsModule } from '@projects/projects.module'

async function bootstrap() {
  const app = await NestFactory.create(ProjectsModule)
  const configService = app.get(ConfigService)
  const rmqService = app.get<RmqService>(RmqService)
  const globalPrefix = 'api'
  const port = configService.get('PORT')
  const config = new DocumentBuilder()
    .addCookieAuth('authCookie', {
      type: 'http',
      in: 'Header',
      scheme: 'Bearer',
    })
    .setTitle('Projects')
    .setDescription('Projects API')
    .setVersion('0.1')
    .addTag('projects')
    .build()

  app.enableCors()
  app.setGlobalPrefix(globalPrefix)
  app.useGlobalPipes(new ValidationPipe())
  app.connectMicroservice(rmqService.getOptions('PROJECTS'))
  Logger.log(`${configService.get<string>('RABBIT_MQ_PROJECTS_QUEUE')} quie activated`)

  const document = SwaggerModule.createDocument(app, config)

  document.servers = [
    {
      url: `http://localhost:${port}`,
      description: 'Local Projects API',
    },
  ]
  SwaggerModule.setup('api', app, document)
  fs.writeFile('swagger-projects.yaml', YAML.stringify(document), (err) => {
    if (err) console.log(err)
  })
  await app.startAllMicroservices()
  await app.listen(port)
}

bootstrap()

