import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'

export const OffersPage = () => {
  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-rose-900">Ofertas</h1>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl text-rose-900">Combo Glow</h2>
          <p className="mt-2 text-sm text-zinc-600">Corte + Escova + Hidratacao com 20% de desconto.</p>
        </Card>
        <Card>
          <h2 className="font-display text-xl text-rose-900">Unhas da Semana</h2>
          <p className="mt-2 text-sm text-zinc-600">Manicure premium com nail art por valor promocional.</p>
        </Card>
      </section>
    </PageContainer>
  )
}
