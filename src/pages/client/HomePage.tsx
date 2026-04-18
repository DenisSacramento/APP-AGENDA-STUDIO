import { Link } from 'react-router-dom'
import { CalendarDays, Clock3, Droplets, Heart, MapPin, MessageCircle, Palette, Scissors, Sparkles, Star } from 'lucide-react'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui/Button'

export const HomePage = () => {
  const serviceCardClass =
    'flex h-full min-h-[252px] flex-col items-center rounded-3xl border border-[#ddb1cf] bg-[#f1e6f3] px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_14px_rgba(87,52,73,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#d39fbe] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_24px_rgba(87,52,73,0.16)]'

  return (
    <PageContainer>
      <section className="mx-auto flex min-h-[calc(100vh-86px)] max-w-3xl flex-col items-center justify-center py-10 text-center">
        <div className="space-y-7">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8e005f] sm:text-base">
            <Sparkles size={16} /> Seu salao de beleza de confianca
          </p>
          <div className="space-y-2">
            <p className="studio-script studio-effect -rotate-[5deg] text-[61px] leading-none text-[#dfc370] sm:text-[85px]">Studio</p>
            <h1 className="text-[40px] font-black uppercase tracking-[0.12em] text-[#d10677] drop-shadow-[0_3px_0_rgba(107,0,69,0.18)] sm:text-[52px]">
              Karine Reverte
            </h1>
          </div>
          <p className="mx-auto max-w-[560px] text-base leading-relaxed text-[#68607d] sm:text-[18px]">
            Aqui nos nao cuidamos somente da estetica, cuidamos de pessoas, devolvendo autoestima, dignidade e alegria. Voce e tratada
            com respeito, honestidade e amor.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link to="/booking">
              <Button className="inline-flex items-center gap-2 bg-[#dbbe64] px-6 py-2.5 text-base font-bold text-[#2f1f05] shadow-[inset_0_1px_0_rgba(255,246,214,0.7),0_8px_18px_rgba(112,89,20,0.28),0_2px_5px_rgba(90,70,14,0.2)] transition duration-300 hover:-translate-y-0.5 hover:!bg-[#cfae4f] hover:!text-[#2a1a04] hover:shadow-[inset_0_1px_0_rgba(255,246,214,0.62),0_14px_28px_rgba(109,82,24,0.34),0_4px_10px_rgba(90,70,14,0.24)]">
                <CalendarDays size={16} /> Agendar Horario
              </Button>
            </Link>
            <Link to="/services">
              <Button
                variant="ghost"
                className="inline-flex items-center gap-2 border border-[#d36bad] bg-transparent px-6 py-2.5 text-base font-bold text-[#9a126f] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_8px_18px_rgba(56,31,46,0.18),0_2px_5px_rgba(39,23,31,0.14)] transition duration-300 hover:-translate-y-0.5 hover:!border-[#cfae4f] hover:!bg-[#cfae4f] hover:!text-[#2a1a04] hover:shadow-[inset_0_1px_0_rgba(255,246,214,0.58),0_14px_28px_rgba(109,82,24,0.34),0_4px_10px_rgba(90,70,14,0.24)]"
              >
                <Scissors size={16} /> Ver Servicos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-20 pt-8">
        <div className="mx-auto w-full">
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#ddb1cf] bg-[#f1e6f3] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_5px_12px_rgba(87,52,73,0.08)]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e6cde0] text-[#af2b7b]">
              <Star size={15} />
            </span>
            <div className="leading-tight">
              <p className="text-[17px] font-bold text-[#261a3b]">Atendimento Personalizado</p>
              <p className="mt-1 text-base text-[#6c5574]">Cada cliente e unica e especial</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#ddb1cf] bg-[#f1e6f3] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_5px_12px_rgba(87,52,73,0.08)]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e6cde0] text-[#af2b7b]">
              <Clock3 size={15} />
            </span>
            <div className="leading-tight">
              <p className="text-[17px] font-bold text-[#261a3b]">Agendamento Online</p>
              <p className="mt-1 text-base text-[#6c5574]">Marque seu horario pelo app</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#ddb1cf] bg-[#f1e6f3] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_5px_12px_rgba(87,52,73,0.08)]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e6cde0] text-[#af2b7b]">
              <MapPin size={15} />
            </span>
            <div className="leading-tight">
              <p className="text-[17px] font-bold text-[#261a3b]">Itaim Paulista, SP</p>
              <p className="mt-1 text-base text-[#6c5574]">Tv. Nicola de Giosa, 37</p>
            </div>
          </div>
          </div>

          <div className="mx-auto mt-24 max-w-3xl text-center sm:mt-28">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8e005f] sm:text-base">O que oferecemos</p>
            <h2 className="mt-3 text-[28px] font-black uppercase tracking-[0.12em] text-[#8e005f] sm:text-[38px]">
              Nossos Servicos
            </h2>
            <p className="mx-auto mt-4 max-w-[620px] text-base leading-relaxed text-[#68607d] sm:text-[18px]">
              Tratamentos especializados para realcar a beleza e saude dos seus cabelos
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className={serviceCardClass}>
              <Scissors className="mx-auto text-[#b03f89]" size={28} />
              <h3 className="mt-3 w-full max-w-[240px] text-[17px] font-extrabold uppercase leading-snug tracking-[0.03em] text-[#34263f] [overflow-wrap:anywhere]">
                Corte Simples
              </h3>
              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">Corte tradicional</p>
              <p className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-[#7b6481]">
                <Clock3 size={14} /> 45 min
              </p>
              <p className="mt-2 text-base font-bold text-[#8e005f]">R$ 35,00</p>
            </article>

            <article className={serviceCardClass}>
              <Scissors className="mx-auto text-[#cf5b50]" size={28} />
              <h3 className="mt-3 w-full max-w-[240px] text-[17px] font-extrabold uppercase leading-snug tracking-[0.03em] text-[#34263f] [overflow-wrap:anywhere]">
                Corte Long Bob/Chanel
              </h3>
              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">Corte long bob ou chanel</p>
              <p className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-[#7b6481]">
                <Clock3 size={14} /> 60 min
              </p>
              <p className="mt-2 text-base font-bold text-[#8e005f]">R$ 40,00</p>
            </article>

            <article className={serviceCardClass}>
              <Sparkles className="mx-auto text-[#d1a33e]" size={28} />
              <h3 className="mt-3 w-full max-w-[240px] text-[17px] font-extrabold uppercase leading-snug tracking-[0.03em] text-[#34263f] [overflow-wrap:anywhere]">
                Progressiva P e M
              </h3>
              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">Progressiva para cabelo pequeno e medio</p>
              <p className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-[#7b6481]">
                <Clock3 size={14} /> 180 min
              </p>
              <p className="mt-2 text-base font-bold text-[#8e005f]">R$ 150,00</p>
            </article>

            <article className={serviceCardClass}>
              <Sparkles className="mx-auto text-[#f08b3d]" size={28} />
              <h3 className="mt-3 w-full max-w-[240px] text-[17px] font-extrabold uppercase leading-snug tracking-[0.03em] text-[#34263f] [overflow-wrap:anywhere]">
                Progressiva G
              </h3>
              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">Progressiva para cabelo grande</p>
              <p className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-[#7b6481]">
                <Clock3 size={14} /> 240 min
              </p>
              <p className="mt-2 text-base font-bold text-[#8e005f]">R$ 200,00</p>
            </article>

            <article className={serviceCardClass}>
              <Palette className="mx-auto text-[#a23ba0]" size={28} />
              <h3 className="mt-3 w-full max-w-[240px] text-[17px] font-extrabold uppercase leading-snug tracking-[0.03em] text-[#34263f] [overflow-wrap:anywhere]">
                Coloracao + Hidratacao
              </h3>
              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">Coloracao com hidratacao</p>
              <p className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-[#7b6481]">
                <Clock3 size={14} /> 120 min
              </p>
              <p className="mt-2 text-base font-bold text-[#8e005f]">R$ 65,00</p>
            </article>

            <article className={serviceCardClass}>
              <Heart className="mx-auto text-[#c44c8f]" size={28} />
              <h3 className="mt-3 w-full max-w-[240px] text-[17px] font-extrabold uppercase leading-snug tracking-[0.03em] text-[#34263f] [overflow-wrap:anywhere]">
                Escova Simples Mega Hair
              </h3>
              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">Escova simples para mega hair</p>
              <p className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-[#7b6481]">
                <Clock3 size={14} /> 90 min
              </p>
              <p className="mt-2 text-base font-bold text-[#8e005f]">R$ 70,00</p>
            </article>

            <article className={serviceCardClass}>
              <Heart className="mx-auto text-[#8d5ac7]" size={28} />
              <h3 className="mt-3 w-full max-w-[240px] text-[17px] font-extrabold uppercase leading-snug tracking-[0.03em] text-[#34263f] [overflow-wrap:anywhere]">
                Escova Mega Hair + Hidratacao
              </h3>
              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">Escova com hidratacao para mega hair</p>
              <p className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-[#7b6481]">
                <Clock3 size={14} /> 120 min
              </p>
              <p className="mt-2 text-base font-bold text-[#8e005f]">R$ 80,00</p>
            </article>

            <article className={serviceCardClass}>
              <Droplets className="mx-auto text-[#4d8bb8]" size={28} />
              <h3 className="mt-3 w-full max-w-[240px] text-[17px] font-extrabold uppercase leading-snug tracking-[0.03em] text-[#34263f] [overflow-wrap:anywhere]">
                Hidroreconstrucao
              </h3>
              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">Tratamento de hidroreconstrucao</p>
              <p className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-[#7b6481]">
                <Clock3 size={14} /> 90 min
              </p>
              <p className="mt-2 text-base font-bold text-[#8e005f]">R$ 70,00</p>
            </article>
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/services">
              <Button
                variant="ghost"
                className="inline-flex items-center gap-2 border border-[#b83286] bg-transparent px-8 py-2.5 text-xl font-bold text-[#a41577] shadow-[0_5px_12px_rgba(40,20,34,0.1)] transition duration-300 hover:-translate-y-0.5 hover:!border-[#cfae4f] hover:!bg-[#cfae4f] hover:!text-[#2a1a04] hover:shadow-[0_12px_24px_rgba(109,82,24,0.3)]"
              >
                Ver todos os servicos
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
