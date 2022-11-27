import { ApiProperty } from '@nestjs/swagger'

export abstract class ApiResponse {
  constructor(success: boolean, message: string) {}

  @ApiProperty({ example: true })
  success: boolean

  @ApiProperty({ example: 'Auditor created' })
  message: string
}

