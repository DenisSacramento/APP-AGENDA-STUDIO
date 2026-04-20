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
  const serviceCardClass =
    'flex h-full min-h-[252px] flex-col items-center rounded-3xl border border-[#ddb1cf] bg-[#f1e6f3] px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_14px_rgba(87,52,73,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#d39fbe] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_24px_rgba(87,52,73,0.16)]'

  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: appointmentService.getServices,
  })

  return (
    <PageContainer>
      <h1 className="text-[28px] font-black uppercase tracking-[0.12em] text-[#8e005f] sm:text-[38px]">Serviços</h1>
      <p className="mt-1 max-w-[640px] text-base leading-relaxed text-[#68607d]">Escolha o serviço ideal para você e reserve em poucos cliques.</p>

      {isLoading ? <p className="mt-6 text-sm">Carregando...</p> : null}

      {!isLoading && (!data || data.length === 0) ? (
        <Card className="mt-6">
          <p className="text-sm text-zinc-600">Nenhum serviço disponível no momento.</p>
        </Card>
      ) : null}

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((service) => (
          <Card key={service.id} className={serviceCardClass}>
            <h3 className="mt-3 w-full max-w-[240px] text-[17px] font-extrabold uppercase leading-snug tracking-[0.03em] text-[#34263f] [overflow-wrap:anywhere]">
              {service.name}
            </h3>
            <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">{service.description}</p>
            <p className="mt-auto pt-2 text-sm text-[#7b6481]">{service.durationMinutes} min</p>
            <p className="mt-2 text-base font-bold text-[#8e005f]">{formatCurrency(Number(service.price))}</p>
            <Link to="/booking" state={{ serviceId: service.id }} className="pt-2 w-full">
              <Button fullWidth>Agendar este serviço</Button>
            </Link>
          </Card>
        ))}
      </section>
    </PageContainer>
  )
}
