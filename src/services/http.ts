const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787/api'

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

  const payload = (await response.json().catch(() => ({}))) as { message?: string }

  if (!response.ok) {
    throw new ApiError(payload.message ?? 'Falha de comunicacao com o servidor', response.status)
  }

  return payload as T
}
