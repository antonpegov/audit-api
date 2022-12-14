import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, Validate } from 'class-validator'

export class LoginRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'my@email1.com' })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'myPassword1' })
  password: string
}

