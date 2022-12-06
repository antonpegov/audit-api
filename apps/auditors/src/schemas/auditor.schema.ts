import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { AbstractDocument } from '@app/common'

@Schema({ versionKey: false })
export class Auditor extends AbstractDocument {
  // Provided by the user:

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  tags: string[]

  // Automatically added fields:

  @Prop({ required: true })
  ownerId: string

  @Prop({ required: true })
  registerDate: Date
}

export const AuditorSchema = SchemaFactory.createForClass(Auditor)

