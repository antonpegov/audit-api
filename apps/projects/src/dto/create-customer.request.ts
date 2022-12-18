import { IsNotEmpty, IsString, Validate } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { ProjectNameAvailable } from '@projects/validators/project-name-available'
import { CustomerContacts } from '@projects/schemas/customer.schema'

export class CreateCustomerRequest {
  @IsString()
  @IsNotEmpty()
  @Validate(ProjectNameAvailable)
  @ApiProperty({ example: 'Anton' })
  fname: string

  @IsNotEmpty()
  @ApiProperty({ example: 'Pegov' })
  lname: string

  @IsNotEmpty()
  @ApiProperty({ example: 'I am web developer' })
  about: string

  @ApiProperty({ example: 'Zeropool' })
  company: string

  @IsNotEmpty()
  @ApiProperty({ example: '{"email": "my@email.com", "telegramm": "@ap"}' })
  contacts: CustomerContacts
}

