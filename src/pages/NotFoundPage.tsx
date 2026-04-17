import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { Button } from '../components/ui/Button'

export const NotFoundPage = () => (
  <PageContainer>
    <section className="py-20 text-center">
      <h1 className="font-display text-5xl text-rose-900">404</h1>
      <p className="mt-2 text-zinc-600">Pagina nao encontrada.</p>
      <Link to="/" className="mt-6 inline-block">
        <Button>Voltar para home</Button>
      </Link>
    </section>
  </PageContainer>
)
