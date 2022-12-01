import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class CreateAuditor {
  @ApiProperty({ example: 'My Name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'my@email.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  // @Validate(IsNotExist, ['Auditor'], {
  //   message: 'emailAlreadyExists',
  // })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'myPassword' })
  @IsNotEmpty()
  password: string
}

