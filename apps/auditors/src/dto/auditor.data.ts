import { ApiProperty } from '@nestjs/swagger'

export class AuditorData {
  @ApiProperty({ example: 'Auditor Name' })
  name: string

  @ApiProperty({ example: 'I am nomber one auditor in security' })
  description: string

  @ApiProperty({ example: '["bitcoin", "crypto"]' })
  tags: string[]
}

