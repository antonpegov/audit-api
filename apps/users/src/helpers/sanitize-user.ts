import { UserData } from '@users/dto/user-data.dto'
import { User } from '@users/schemas/user.schema'

export const sanitizeUser = (_user: User): UserData => {
  const user = JSON.parse(JSON.stringify(_user)) as User

  delete user.password
  delete user._id

  return user
}
