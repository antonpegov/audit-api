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
  const server = configService.get('SERVER')
  const port = configService.get('PORT')
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Projects')
    .setDescription('Projects API')
    .setVersion('0.1')
    .addTag('projects')
    .build()

  app.enableCors()
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  app.connectMicroservice(rmqService.getOptions('PROJECTS'))
  Logger.log(`${configService.get<string>('RABBIT_MQ_PROJECTS_QUEUE')} quie activated`)

  //#region Swagger
  const document = SwaggerModule.createDocument(app, config)
  const swaggerPath = 'swagger-projects.yaml'
  const apiURL = `${server}:${port}`

  document.servers = [
    {
      url: apiURL,
      description: 'Projects API',
    },
  ]
  SwaggerModule.setup('api', app, document)
  Logger.log(`Writing ${swaggerPath} filefor ${apiURL}...`)

  fs.writeFile(swaggerPath, YAML.stringify(document), (err) => {
    if (err) console.log(err)
  })

  Logger.log(`Writing ${swaggerPath} file... Done`)
  //#endregion

  await app.startAllMicroservices()
  await app.listen(port)
}

bootstrap()
