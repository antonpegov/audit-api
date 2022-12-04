import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

import { UserData } from '@users/dto/user-data.dto'

export class LoginResponse {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '<JWT_TOKEN>' })
  token: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: {} })
  user: UserData
}
