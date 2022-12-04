import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { AbstractDocument } from '@app/common'

export enum UserStatus {
  NEW = 'new',
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  BANNED = 'banned',
}

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  status: UserStatus
}

export const UserSchema = SchemaFactory.createForClass(User)
