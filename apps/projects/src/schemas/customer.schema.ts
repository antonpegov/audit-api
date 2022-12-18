import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { AbstractDocument } from '@app/common'

@Schema({ versionKey: false })
export class CustomerContacts {
  @Prop({ required: true })
  email: string

  @Prop({ required: false })
  telegram: string
}

@Schema({ versionKey: false })
export class Customer extends AbstractDocument {
  // Provided by the user:

  @Prop({ required: true })
  fname: string

  @Prop({ required: true })
  lname: string

  @Prop({ required: true })
  about: string

  @Prop({ required: false })
  company: string

  @Prop({ required: true })
  contacts: CustomerContacts

  // Automatically added fields:

  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  createdAt: Date

  @Prop({ required: true })
  updatedAt: Date
}

export const CustomerSchema = SchemaFactory.createForClass(Customer)

