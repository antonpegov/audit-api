import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { AbstractDocument } from '@app/common'

export enum UserStatus {
  NEW = 'new',
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  BANNED = 'banned',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserAccountType {
  CLIENT = 'client',
  AUDITOR = 'auditor',
}

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  // Provided by user

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  requestedAccountType: UserAccountType

  // Provided by system

  @Prop({ required: true })
  status: UserStatus

  @Prop({ required: true })
  role: UserRole

  @Prop({ required: true })
  createdAt: Date

  @Prop({ required: true })
  updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

