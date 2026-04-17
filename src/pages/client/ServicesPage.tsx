import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { appointmentService } from '../../services/appointment.service'

export const ServicesPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: appointmentService.getServices,
  })

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-rose-900">Servicos</h1>
      <p className="mt-1 text-sm text-zinc-600">Escolha o servico ideal para voce.</p>

      {isLoading ? <p className="mt-6 text-sm">Carregando...</p> : null}

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((service) => (
          <Card key={service.id} className="flex h-full flex-col justify-between gap-4">
            <div className="space-y-2">
              <h2 className="font-display text-xl text-rose-900">{service.name}</h2>
              <p className="text-sm text-zinc-600">{service.description}</p>
              <p className="text-xs text-zinc-500">Duracao: {service.durationMinutes} min</p>
            </div>
            <Link to="/booking" className="pt-2">
              <Button fullWidth>Selecionar servico</Button>
            </Link>
          </Card>
        ))}
      </section>
    </PageContainer>
  )
}
