import { BadRequestException } from '@nestjs/common'
import { ValidationError } from 'class-validator'

import { toOneString } from '@app/common/utils/to-one-string'

export const validationConfigurator = {
  exceptionFactory: (validationErrors: ValidationError[] = []) => {
    const customisedErrors = validationErrors.map((err) => {
      if (err.constraints) {
        const keys = Object.keys(err.constraints)

        return toOneString(keys.map((key) => err.constraints[key]))
      }
    })

    return new BadRequestException(toOneString(customisedErrors))
  },
}

