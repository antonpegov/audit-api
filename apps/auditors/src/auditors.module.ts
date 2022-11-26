import { Module } from '@nestjs/common';
import { AuditorsController } from './auditors.controller';
import { AuditorsService } from './auditors.service';

@Module({
  imports: [],
  controllers: [AuditorsController],
  providers: [AuditorsService],
})
export class AuditorsModule {}
