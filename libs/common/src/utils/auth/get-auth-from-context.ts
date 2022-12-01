import { ExecutionContext, UnauthorizedException } from '@nestjs/common'

export const getAuthFromContext = (context: ExecutionContext): string => {
  let authentication: string

  if (context.getType() === 'rpc') {
    authentication = context.switchToRpc().getData().Authentication
  } else if (context.getType() === 'http') {
    authentication = context.switchToHttp().getRequest().headers?.authorization
  }
  if (!authentication) {
    throw new UnauthorizedException('No value was provided for Authentication')
  }
  return authentication
}

