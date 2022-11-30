import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class LoginRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'my@email.com' })
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'myPassword' })
  password: string
}

