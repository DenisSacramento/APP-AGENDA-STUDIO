import { useQuery } from '@tanstack/react-query'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { appointmentService } from '../../services/appointment.service'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)

export const OffersPage = () => {
  const { data: offers } = useQuery({
    queryKey: ['offers'],
    queryFn: () => appointmentService.getOffers(),
  })

  return (
    <PageContainer>
      <h1 className="text-[28px] font-black uppercase tracking-[0.12em] text-[#8e005f] sm:text-[38px]">Ofertas</h1>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {offers?.length ? (
          offers.map((offer) => (
            <Card key={offer.id} className="space-y-2 border-[#e6d7ea] bg-white/92">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8e005f]">Oferta especial</p>
              <h2 className="break-words text-[20px] font-extrabold uppercase tracking-[0.03em] text-[#5a4566]">{offer.serviceName}</h2>
              <p className="text-base font-bold text-[#8e005f]">{formatCurrency(Number(offer.offerPrice))}</p>
            </Card>
          ))
        ) : (
          <Card className="border-[#e6d7ea] bg-white/85 md:col-span-2">
            <p className="text-sm font-medium text-[#6c5574]">Nenhuma oferta disponível no momento.</p>
          </Card>
        )}
      </section>
    </PageContainer>
  )
}
