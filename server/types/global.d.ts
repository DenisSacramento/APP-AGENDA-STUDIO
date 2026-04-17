declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string
        email: string
        role: 'client' | 'admin'
        name: string
      }
    }
  }
}

export {}
