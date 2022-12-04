import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserData {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'My Name' })
  name: string

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'my@email1.com' })
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Active' })
  status: string
}
