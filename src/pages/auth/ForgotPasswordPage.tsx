import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { PageContainer } from '../../components/layout/PageContainer'
import { authService } from '../../services/auth.service'

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      const result = await authService.forgotPassword({ email })
      alert(result.message)
      setEmail('')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Falha na solicitacao')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <Card className="mx-auto mt-10 max-w-md space-y-4">
        <h1 className="font-display text-3xl text-rose-900">Recuperar senha</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Button fullWidth type="submit" disabled={loading}>
            Enviar link de recuperacao
          </Button>
        </form>
      </Card>
    </PageContainer>
  )
}
