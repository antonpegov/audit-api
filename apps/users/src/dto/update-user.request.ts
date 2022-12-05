import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserRequest {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'My Name 2' })
  name: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'myPassword2' })
  password: string
}
