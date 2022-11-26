import { Test, TestingModule } from '@nestjs/testing';
import { AuditorsController } from './auditors.controller';
import { AuditorsService } from './auditors.service';

describe('AuditorsController', () => {
  let auditorsController: AuditorsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuditorsController],
      providers: [AuditorsService],
    }).compile();

    auditorsController = app.get<AuditorsController>(AuditorsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(auditorsController.getHello()).toBe('Hello World!');
    });
  });
});
