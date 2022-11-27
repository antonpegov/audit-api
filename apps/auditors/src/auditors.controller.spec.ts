import { Test, TestingModule } from '@nestjs/testing'

import { AuditorsController } from '@auditors/auditors.controller'
import { AuditorsService } from '@auditors/auditors.service'

describe('AuditorsController', () => {
  let auditorsController: AuditorsController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuditorsController],
      providers: [AuditorsService],
    }).compile()

    auditorsController = app.get<AuditorsController>(AuditorsController)
  })
})

