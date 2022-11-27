import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { AbstractDocument } from '@app/common'

@Schema({ versionKey: false })
export class Project extends AbstractDocument {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string
}

export const ProjectSchema = SchemaFactory.createForClass(Project)

