import { Controller, Get } from '@nestjs/common';
import { AuditorsService } from './auditors.service';

@Controller()
export class AuditorsController {
  constructor(private readonly auditorsService: AuditorsService) {}

  @Get()
  getHello(): string {
    return this.auditorsService.getHello();
  }
}
