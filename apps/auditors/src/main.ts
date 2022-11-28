import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
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
  const globalPrefix = 'api'
  const port = configService.get('PORT')
  const config = new DocumentBuilder()
    .setTitle('Auditors')
    .setDescription('Auditors API')
    .setVersion('0.1')
    .addTag('auditors')
    .build()

  app.setGlobalPrefix(globalPrefix)
  app.useGlobalPipes(new ValidationPipe())
  app.connectMicroservice(rmqService.getOptions('AUDITORS'))

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document)
  fs.writeFile('swagger-auditors.yaml', YAML.stringify(document), (err) => {
    if (err) console.log(err)
    else {
      console.log('swagger.yaml file has been updated successfully\n')
    }
  })

  await app.startAllMicroservices()
  await app.listen(port)
}

bootstrap()
