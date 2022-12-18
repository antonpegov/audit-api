import { ApiProperty } from '@nestjs/swagger'

import { CustomerContacts } from '@projects/schemas/customer.schema'

export class CustomerData {
  @ApiProperty({ example: 'Anton' })
  fname: string

  @ApiProperty({ example: 'Pegov' })
  lname: string

  @ApiProperty({ example: 'I am a web developer' })
  about: string

  @ApiProperty({ example: 'ZeroPool' })
  company: string

  @ApiProperty({ example: '{email: "my@email.co", telegramm: "@ap"}' })
  contacts: CustomerContacts
}

