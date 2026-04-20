import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { appointmentService } from '../../services/appointment.service'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)

export const ServicesPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: appointmentService.getServices,
  })

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-rose-900">Servicos</h1>
      <p className="mt-1 text-sm text-zinc-600">Escolha o servico ideal para voce e reserve em poucos cliques.</p>

      {isLoading ? <p className="mt-6 text-sm">Carregando...</p> : null}

      {!isLoading && (!data || data.length === 0) ? (
        <Card className="mt-6">
          <p className="text-sm text-zinc-600">Nenhum servico disponivel no momento.</p>
        </Card>
      ) : null}

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((service) => (
          <Card key={service.id} className="flex h-full flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-xl leading-tight text-rose-900">{service.name}</h2>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-900">
                  {service.durationMinutes} min
                </span>
              </div>
              <p className="text-sm text-zinc-600">{service.description}</p>
              <p className="text-2xl font-semibold text-zinc-900">{formatCurrency(service.price)}</p>
            </div>
            <Link to="/booking" className="pt-2">
              <Button fullWidth>Agendar este servico</Button>
            </Link>
          </Card>
        ))}
      </section>
    </PageContainer>
  )
}
