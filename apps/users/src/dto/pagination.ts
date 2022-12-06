import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class Pagination<T> {
  @IsNotEmpty()
  @ApiProperty({ example: [] })
  data: T[]

  @IsNotEmpty()
  @ApiProperty({ example: true })
  hasNextPage: boolean

  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  page: number

  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  limit: number
}

