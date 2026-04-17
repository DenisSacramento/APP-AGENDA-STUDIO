import xss from 'xss'

export const sanitizeInput = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return xss(value.trim())
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeInput)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, current]) => [key, sanitizeInput(current)]),
    )
  }

  return value
}
