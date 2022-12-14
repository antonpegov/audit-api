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
  @ApiProperty({ example: 'my@email1.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'myPassword1' })
  password: string
}
