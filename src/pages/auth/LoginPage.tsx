import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAuth } from '../../hooks/useAuth'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Falha no login')
    }
  }

  return (
    <PageContainer>
      <Card className="mx-auto mt-10 max-w-md space-y-4">
        <h1 className="font-display text-3xl text-rose-900">Entrar</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button fullWidth type="submit">
            Acessar conta
          </Button>
        </form>
        <div className="flex justify-between text-sm">
          <Link to="/forgot-password" className="text-rose-600">
            Esqueci minha senha
          </Link>
          <Link to="/register" className="text-rose-600">
            Criar conta
          </Link>
        </div>
      </Card>
    </PageContainer>
  )
}
