import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

export const HomePage = () => {
  return (
    <PageContainer>
      <section className="grid gap-6 py-10 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1 text-xs font-semibold text-rose-700">
            <Sparkles size={14} /> Experiencia premium de beleza
          </p>
          <h1 className="font-display text-4xl leading-tight text-rose-900 sm:text-5xl">
            Studio Karine Reverte
          </h1>
          <p className="max-w-xl text-zinc-600">
            Seu tempo e sua beleza importam. Agende servicos com poucos cliques e acompanhe tudo em um painel moderno.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/services">
              <Button>Servicos</Button>
            </Link>
            <Link to="/booking">
              <Button variant="secondary">Agendar</Button>
            </Link>
            <Link to="/offers">
              <Button variant="ghost">Ofertas</Button>
            </Link>
          </div>
        </div>

        <Card className="space-y-3 bg-gradient-to-br from-white to-rose-50">
          <h2 className="font-display text-2xl text-rose-900">Atendimento personalizado</h2>
          <p className="text-sm text-zinc-600">
            Corte, coloracao, manicure e tratamentos com agenda inteligente, sem conflitos e com confirmacao em tempo real.
          </p>
          <ul className="space-y-2 text-sm text-zinc-700">
            <li>Agenda organizada por horario</li>
            <li>Historico de agendamentos</li>
            <li>Painel administrativo completo</li>
          </ul>
        </Card>
      </section>
    </PageContainer>
  )
}
