import { ApiProperty } from '@nestjs/swagger'

export class ProjectData {
  @ApiProperty({ example: 'Project Name' })
  name: string

  @ApiProperty({ example: 'Privacy for blockchain' })
  description: string

  @ApiProperty({ example: '["bitcoin", "crypto"]' })
  tags: string[]
}

