import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, Validate } from 'class-validator'
import { User } from '@users/schemas/user.schema'

export class LoginResponse {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'JWT_TOKEN' })
  token: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: {} })
  user: User
}

