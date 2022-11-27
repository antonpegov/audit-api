import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Validate } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

import { ApiResponse } from '@auditors/dto/response.dto'
import { Auditor } from '@auditors/schemas/auditor.schema'

export class CreateAuditorRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  // @Validate(IsNotExist, ['Auditor'], {
  //   message: 'emailAlreadyExists',
  // })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'myPass1' })
  @IsNotEmpty()
  password: string
}

