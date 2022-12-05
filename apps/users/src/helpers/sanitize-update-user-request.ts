import { UpdateUserRequest } from '@users/dto/update-user.request'
import { UserData } from '@users/dto/user-data.dto'
import { User } from '@users/schemas/user.schema'

export const sanitizeUpdateUserRequest = (
  _user: UpdateUserRequest,
): UpdateUserRequest => {
  const user = JSON.parse(JSON.stringify(_user)) as User

  delete user.email
  delete user._id
  delete user.status

  return user
}
