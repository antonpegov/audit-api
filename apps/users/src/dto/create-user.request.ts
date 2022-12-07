import { IsEmail, IsNotEmpty, IsString, Matches, Validate } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

import { EmailAvailable } from '@users/validators/email-available'
import { UserAccountType } from '@users/schemas/user.schema'

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'My Name' })
  name: string

  @IsEmail()
  @IsNotEmpty()
  @Validate(EmailAvailable)
  @ApiProperty({ example: 'my@email1.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'myPassword1' })
  password: string

  @IsString()
  @Matches(`^(client|auditor)$`)
  @ApiProperty({ example: 'auditor' })
  requestedAccountType: UserAccountType
}

