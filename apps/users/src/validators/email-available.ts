import { Injectable } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'

import { UsersRepository } from '@users/users.repository'

@ValidatorConstraint({ name: 'EmailAvailable', async: true })
@Injectable()
export class EmailAvailable implements ValidatorConstraintInterface {
  constructor(private usersRepository: UsersRepository) {}

  async validate(name: string) {
    try {
      const user = await this.usersRepository.findOne({ name })

      return !user
    } catch (e) {
      return true
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `User with that email already exists`
  }
}

