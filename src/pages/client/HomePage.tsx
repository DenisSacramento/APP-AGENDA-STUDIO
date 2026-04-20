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
            <Sparkles size={16} /> Seu salão de beleza de confiança
          </p>
          <div className="space-y-2">
            <p className="studio-script studio-effect -rotate-[5deg] text-[61px] leading-none text-[#dfc370] sm:text-[85px]">Studio</p>
            <h1 className="text-[40px] font-black uppercase tracking-[0.12em] text-[#d10677] drop-shadow-[0_3px_0_rgba(107,0,69,0.18)] sm:text-[52px]">
              Karine Reverte
            </h1>
          </div>
          <p className="mx-auto max-w-[560px] text-base leading-relaxed text-[#68607d] sm:text-[18px]">
            Aqui nós não cuidamos somente da estética, cuidamos de pessoas, devolvendo autoestima, dignidade e alegria. Você é tratada
            com respeito, honestidade e amor.
          </p>
          {/* CTA removido: acesso aos serviços disponível no menu e na seção 'Ver todos os serviços' */}
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
              <p className="mt-1 text-base text-[#6c5574]">Cada cliente é única e especial</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#ddb1cf] bg-[#f1e6f3] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_5px_12px_rgba(87,52,73,0.08)]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e6cde0] text-[#af2b7b]">
              <Clock3 size={15} />
            </span>
            <div className="leading-tight">
              <p className="text-[17px] font-bold text-[#261a3b]">Agendamento Online</p>
              <p className="mt-1 text-base text-[#6c5574]">Marque seu horário pelo app</p>
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
              Nossos Serviços
            </h2>
            <p className="mx-auto mt-4 max-w-[620px] text-base leading-relaxed text-[#68607d] sm:text-[18px]">
              Tratamentos especializados para realçar a beleza e saúde dos seus cabelos
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
              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">Progressiva para cabelo pequeno e médio</p>
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
                Coloração + Hidratação
              </h3>
              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">Coloração com hidratação</p>
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
                Escova Mega Hair + Hidratação
              </h3>
              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">Escova com hidratação para mega hair</p>
              <p className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-[#7b6481]">
                <Clock3 size={14} /> 120 min
              </p>
              <p className="mt-2 text-base font-bold text-[#8e005f]">R$ 80,00</p>
            </article>

            <article className={serviceCardClass}>
              <Droplets className="mx-auto text-[#4d8bb8]" size={28} />
              <h3 className="mt-3 w-full max-w-[240px] text-[17px] font-extrabold uppercase leading-snug tracking-[0.03em] text-[#34263f] [overflow-wrap:anywhere]">
                Hidroreconstrução
              </h3>
              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-[#6c5574]">Tratamento de hidroreconstrução</p>
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
                Ver todos os serviços
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-12 pt-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[28px] font-black text-[#8e005f] sm:text-[38px]">Ficou com dúvidas?</h2>
          <p className="mx-auto mt-4 max-w-[640px] text-base leading-relaxed text-[#68607d] sm:text-[18px]">
            Entre em contato diretamente com a Karine pelo WhatsApp para tirar dúvidas ou finalizar seu agendamento.
          </p>
          <a
            href="https://wa.me/5511910928534"
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#dbbe64] px-7 py-3 text-base font-bold text-[#2f1f05] shadow-[inset_0_1px_0_rgba(255,246,214,0.7),0_8px_18px_rgba(112,89,20,0.28),0_2px_5px_rgba(90,70,14,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#cfae4f]"
          >
            <MessageCircle size={17} /> Falar no WhatsApp
          </a>
        </div>
      </section>

      <footer className="overflow-hidden rounded-[28px] border border-[#d9d1e4] bg-[#f2edf7] px-6 py-8 text-[#3d2f4a] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_22px_rgba(66,45,84,0.08)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="leading-tight">
              <span className="studio-script studio-effect block -rotate-[3deg] text-[22px] leading-none text-[#debf6d]">Studio</span>
              <span className="block mt-0.5 text-[15px] font-black tracking-[0.1em] text-[#d10677]">KARINE REVERTE</span>
            </h3>
            <p className="mt-1 text-base text-[#6a5a78]">Tv. Nicola de Giosa, 37 - Itaim Paulista, São Paulo</p>
          </div>
          <div className="text-base text-[#6a5a78] sm:text-right">
            <p>WhatsApp: (11) 91092-8534</p>
            <p>Seg-Sex: 9h-19h | Sáb: 9h-17h</p>
          </div>
        </div>
        <div className="mt-6 border-t border-[#ddd4e7] pt-5 text-center text-sm text-[#7c7088]">
          <p>© 2026 Studio Karine Reverte. Todos os direitos reservados.</p>
          <p className="mt-1 text-xs text-[#94899f]">Desenvolvido por Denis Sacramento- DSDEV</p>
        </div>
      </footer>

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
