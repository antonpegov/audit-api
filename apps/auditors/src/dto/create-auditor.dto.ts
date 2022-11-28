import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class CreateAuditor {
  @ApiProperty({ example: 'My Name' })
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
