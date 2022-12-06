import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const getCurrentUserIdByContext = (context: ExecutionContext): string => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user.valueOf().userId
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user.valueOf().userId
  }
}

export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getCurrentUserIdByContext(context),
)

