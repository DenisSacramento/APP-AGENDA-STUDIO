import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'

export const ProfilePage = () => {
  const { user } = useAuth()

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-rose-900">Meu perfil</h1>
      <Card className="mt-6 max-w-xl space-y-2">
        <p className="text-sm text-zinc-600">Nome</p>
        <p className="text-lg font-semibold text-zinc-900">{user?.name}</p>
        <p className="pt-3 text-sm text-zinc-600">Email</p>
        <p className="text-lg font-semibold text-zinc-900">{user?.email}</p>
      </Card>
    </PageContainer>
  )
}
