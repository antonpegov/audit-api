import { NestFactory } from '@nestjs/core';
import { AuditorsModule } from './auditors.module';

async function bootstrap() {
  const app = await NestFactory.create(AuditorsModule);
  await app.listen(3000);
}
bootstrap();
