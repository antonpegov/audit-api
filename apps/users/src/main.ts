import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as YAML from 'json-to-pretty-yaml'
import * as fs from 'fs'

import { RmqService } from '@app/common'
import { UsersModule } from '@users/users.module'

async function bootstrap() {
  const app = await NestFactory.create(UsersModule)
  const configService = app.get(ConfigService)
  const rmqService = app.get<RmqService>(RmqService)
  const globalPrefix = 'api'
  const port = configService.get('PORT')
  const config = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('Users API')
    .setVersion('0.1')
    .addTag('users')
    .build()

  app.enableCors()
  app.setGlobalPrefix(globalPrefix)
  app.useGlobalPipes(new ValidationPipe())
  app.connectMicroservice(rmqService.getOptions('USERS'))
  Logger.log(`${configService.get<string>('RABBIT_MQ_USERS_QUEUE')} quie activated`)

  const document = SwaggerModule.createDocument(app, config)

  document.servers = [
    {
      url: `http://localhost:${port}`,
      description: 'Local Users API',
    },
  ]
  SwaggerModule.setup('api', app, document)
  fs.writeFile('swagger-users.yaml', YAML.stringify(document), (err) => {
    if (err) console.log(err)
  })

  await app.startAllMicroservices()
  await app.listen(port)
}

bootstrap()

