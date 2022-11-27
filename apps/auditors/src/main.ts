import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AuditorsModule } from '@auditors/auditors.module'

async function bootstrap() {
  const app = await NestFactory.create(AuditorsModule)
  const configService = app.get(ConfigService)
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

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document)

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix)
  })
}

bootstrap()

