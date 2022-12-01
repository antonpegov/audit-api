import { ExecutionContext } from '@nestjs/common'

export const addToContext = <T>(name: string, value: T, context: ExecutionContext) => {
  console.log('Adding to context:', name, value)

  if (context.getType() === 'rpc') {
    context.switchToRpc().getData()[name] = value
  } else if (context.getType() === 'http') {
    context.switchToHttp().getRequest()[name] = value
  }

  return context
}

