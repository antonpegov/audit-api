import { Injectable } from '@nestjs/common'

@Injectable()
export class AuditorsService {
  getHello(): string {
    return 'Hello World!'
  }
}

