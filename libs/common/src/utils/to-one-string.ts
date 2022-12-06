export const toOneString = <T>(value: T): string => {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (value instanceof Array) {
    return value.map(toOneString).join(', ')
  }

  if (value instanceof Object) {
    return Object.keys(value)
      .map((key) => `${key}: ${toOneString(value[key])}`)
      .join(', ')
  }

  return ''
}

