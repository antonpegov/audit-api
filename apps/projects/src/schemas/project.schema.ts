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

  // Automatically added fields:
  @Prop({ required: true })
  ownerId: string

  @Prop({ required: true })
  startDate: Date
}

export const ProjectSchema = SchemaFactory.createForClass(Project)

