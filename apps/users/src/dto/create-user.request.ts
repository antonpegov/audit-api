import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'My Name' })
  name: string

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  @ApiProperty({ example: 'my@email1.com' })
  // @Validate(IsNotExist, ['User'], {
  //   message: 'emailAlreadyExists',
  // })
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'myPassword1' })
  password: string
}

