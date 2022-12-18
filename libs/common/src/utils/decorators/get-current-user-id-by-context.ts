import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const getCurrentUserIdByContext = (context: ExecutionContext): string => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().userId
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().userId
  }
}

export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getCurrentUserIdByContext(context),
)

