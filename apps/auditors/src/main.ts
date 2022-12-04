import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as YAML from 'json-to-pretty-yaml'
import * as fs from 'fs'

import { RmqService } from '@app/common'
import { AuditorsModule } from '@auditors/auditors.module'

async function bootstrap() {
  const app = await NestFactory.create(AuditorsModule)
  const configService = app.get(ConfigService)
  const rmqService = app.get<RmqService>(RmqService)
  const server = configService.get('SERVER')
  const port = configService.get('PORT')
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Auditors')
    .setDescription('Auditors API')
    .setVersion('0.1')
    .addTag('auditors')
    .build()

  app.enableCors()
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  app.connectMicroservice(rmqService.getOptions('AUDITORS'))
  Logger.log(`${configService.get<string>('RABBIT_MQ_AUDITORS_QUEUE')} quie activated`)

  //#region Swagger
  const document = SwaggerModule.createDocument(app, config)
  const swaggerPath = 'swagger-auditors.yaml'
  const apiURL = `${server}:${port}`

  document.servers = [
    {
      url: apiURL,
      description: 'Auditors API',
    },
  ]

  SwaggerModule.setup('api', app, document)
  Logger.log(`Writing ${swaggerPath} file for ${apiURL}...`)

  fs.writeFile(swaggerPath, YAML.stringify(document), (err) => {
    if (err) console.log(err)
  })

  Logger.log(`Writing ${swaggerPath} file... Done`)
  //#endregion

  await app.startAllMicroservices()
  await app.listen(port)
}

bootstrap()
