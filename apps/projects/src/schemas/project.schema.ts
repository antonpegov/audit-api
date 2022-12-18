import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { AbstractDocument } from '@app/common'

@Schema({ versionKey: false })
export class Project extends AbstractDocument {
  // Provided by the user:

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  gitUrl: string

  @Prop({ required: true, type: Object })
  gitFolders: Record<string, string>

  @Prop({ required: true })
  tags: string[]

  @Prop({ required: true })
  customerId: string

  // Automatically added fields:

  @Prop({ required: true })
  createdAt: Date

  @Prop({ required: true })
  updatedAt: Date
}

export const ProjectSchema = SchemaFactory.createForClass(Project)

