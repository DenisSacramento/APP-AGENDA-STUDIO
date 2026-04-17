const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://app-agenda-studio.onrender.com/api'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string
}

export const request = async <T>(path: string, config: RequestConfig = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: config.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}),
    },
    body: config.body ? JSON.stringify(config.body) : undefined,
  })

  const payload = (await response.json().catch(() => ({}))) as {
    message?: string
    errors?: string[]
  }

  if (!response.ok) {
    const details = payload.errors?.length ? `: ${payload.errors.join(', ')}` : ''
    throw new ApiError(
      `${payload.message ?? 'Falha de comunicacao com o servidor'}${details}`,
      response.status,
    )
  }

  return payload as T
}
