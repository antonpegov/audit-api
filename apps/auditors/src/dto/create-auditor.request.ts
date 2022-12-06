import { IsNotEmpty, IsString, Validate } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { AuditorNameAvailable } from '@auditors/validators/auditor-name-available'

export class CreateAuditorRequest {
  @ApiProperty({ example: 'My Name' })
  @IsString()
  @IsNotEmpty()
  @Validate(AuditorNameAvailable)
  name: string

  @IsNotEmpty()
  @ApiProperty({ example: 'Some Description' })
  description: string

  @IsNotEmpty()
  @ApiProperty({ example: 'https://my.site.com' })
  personalSiteUrl: string

  @IsNotEmpty()
  @ApiProperty({ example: '{"Facebook": "anton-pegov", "Twitter": "antonpegov"}' })
  contacts: Record<string, string>

  @IsNotEmpty()
  @ApiProperty({ example: '["bitcoin", "privacy"]' })
  tags: string[]
}

