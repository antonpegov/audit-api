import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator'

export class Pagination<T> {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ example: [] })
  data: T[]

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: true })
  hasNextPage: boolean
}
