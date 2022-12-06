import { Injectable } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'

import { AuditorsRepository } from '@auditors/auditors.repository'

@ValidatorConstraint({ name: 'AuditorNameAvailable', async: true })
@Injectable()
export class AuditorNameAvailable implements ValidatorConstraintInterface {
  constructor(private projectsRepository: AuditorsRepository) {}

  async validate(name: string) {
    try {
      const auditor = await this.projectsRepository.findOne({ name })

      return !auditor
    } catch (e) {
      return true
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Auditor with that name already exists`
  }
}

