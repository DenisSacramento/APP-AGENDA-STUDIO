import { Link } from 'react-router-dom'
import { CalendarDays, MessageCircle, Scissors, Sparkles } from 'lucide-react'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui/Button'

export const HomePage = () => {
  return (
    <PageContainer>
      <section className="mx-auto flex min-h-[calc(100vh-86px)] max-w-3xl flex-col items-center justify-center py-10 text-center">
        <div className="space-y-7">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8e005f] sm:text-base">
            <Sparkles size={16} /> Seu salao de beleza de confianca
          </p>
          <div className="space-y-2">
            <p className="studio-script studio-effect -rotate-[5deg] text-[61px] leading-none text-[#dfc370] sm:text-[85px]">Studio</p>
            <h1 className="text-5xl font-black uppercase tracking-[0.14em] text-[#d10677] drop-shadow-[0_3px_0_rgba(107,0,69,0.18)] sm:text-6xl">
              Karine Reverte
            </h1>
          </div>
          <p className="mx-auto max-w-[560px] text-base leading-relaxed text-[#68607d] sm:text-[18px]">
            Aqui nos nao cuidamos somente da estetica, cuidamos de pessoas, devolvendo autoestima, dignidade e alegria. Voce e tratada
            com respeito, honestidade e amor.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link to="/booking">
              <Button className="inline-flex items-center gap-2 bg-[#dbbe64] px-8 py-3 text-xl font-bold text-[#2f1f05] shadow-[0_6px_16px_rgba(112,89,20,0.2)] hover:bg-[#ccb055]">
                <CalendarDays size={18} /> Agendar Horario
              </Button>
            </Link>
            <Link to="/services">
              <Button
                variant="ghost"
                className="inline-flex items-center gap-2 border border-[#d36bad] bg-transparent px-8 py-3 text-xl font-bold text-[#9a126f] hover:bg-[#f6ebf2]"
              >
                <Scissors size={18} /> Ver Servicos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/5500000000000"
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#22c35e] text-white shadow-[0_8px_18px_rgba(14,118,53,0.35)] transition hover:scale-105"
      >
        <MessageCircle size={28} />
      </a>
    </PageContainer>
  )
}
