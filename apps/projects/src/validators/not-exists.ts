import { Injectable } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'

import { ProjectsRepository } from '@projects/projects.repository'

@ValidatorConstraint({ name: 'ProjectNameAvailable', async: true })
@Injectable()
export class ProjectNameAvailable implements ValidatorConstraintInterface {
  constructor(private projectsRepository: ProjectsRepository) {}

  async validate(name: string) {
    try {
      const project = await this.projectsRepository.findOne({ name })

      return !project
    } catch (e) {
      return true
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Project with that name already exists`
  }
}

