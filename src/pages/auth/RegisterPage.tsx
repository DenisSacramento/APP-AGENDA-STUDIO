import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAuth } from '../../hooks/useAuth'

export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await register(name, email, password)
      navigate('/')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Falha no cadastro')
    }
  }

  return (
    <PageContainer>
      <Card className="mx-auto mt-10 max-w-md space-y-4">
        <h1 className="font-display text-3xl text-rose-900">Criar conta</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="Nome" value={name} onChange={(event) => setName(event.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button fullWidth type="submit">
            Cadastrar
          </Button>
        </form>
        <p className="text-sm text-zinc-600">
          Ja possui conta?{' '}
          <Link to="/login" className="text-rose-600">
            Entrar
          </Link>
        </p>
      </Card>
    </PageContainer>
  )
}
