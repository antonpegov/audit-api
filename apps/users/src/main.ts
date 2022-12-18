import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as YAML from 'json-to-pretty-yaml'
import * as fs from 'fs'

import { RmqService, validationConfigurator } from '@app/common'
import { useContainer } from 'class-validator'
import { UsersModule } from '@users/users.module'

async function bootstrap() {
  const app = await NestFactory.create(UsersModule)
  const configService = app.get(ConfigService)
  const rmqService = app.get<RmqService>(RmqService)
  const server = configService.get('SERVER')
  const port = configService.get('PORT')
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Users')
    .setDescription('Users API')
    .setVersion('0.1')
    .addTag('users')
    .build()

  app.enableCors()
  app.setGlobalPrefix('api')
  app.connectMicroservice(rmqService.getOptions('AUTH'))
  app.connectMicroservice(rmqService.getOptions('USERS'))
  app.useGlobalPipes(new ValidationPipe(validationConfigurator))
  useContainer(app.select(UsersModule), { fallbackOnErrors: true })
  Logger.log(`${configService.get<string>('RABBIT_MQ_USERS_QUEUE')} quie activated`)
  Logger.log(`${configService.get<string>('RABBIT_MQ_AUTH_QUEUE')} quie activated`)

  //#region Swagger
  const document = SwaggerModule.createDocument(app, config)
  const swaggerPath = 'swagger-users.yaml'
  const apiURL = `${server}:${port}`

  document.servers = [
    {
      url: apiURL,
      description: 'Users API',
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

