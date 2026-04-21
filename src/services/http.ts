const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? '/api'

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
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: config.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}),
      },
      body: config.body ? JSON.stringify(config.body) : undefined,
    })
  } catch {
    throw new ApiError('Nao foi possivel conectar ao servidor', 0)
  }

  const raw = await response.text().catch(() => '')
  const payload = (() => {
    if (!raw) return {}
    try {
      return JSON.parse(raw) as { message?: string; errors?: string[] }
    } catch {
      return {}
    }
  })()

  if (!response.ok) {
    const details = payload.errors?.length ? `: ${payload.errors.join(', ')}` : ''
    const fallbackMessage = `Falha de comunicacao com o servidor (${response.status})`
    throw new ApiError(
      `${payload.message ?? fallbackMessage}${details}`,
      response.status,
    )
  }

  return payload as T
}
