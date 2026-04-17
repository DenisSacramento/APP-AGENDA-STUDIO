# Studio Karine Reverte - Web App Completo

Aplicativo completo para salao de beleza com fluxo de agendamento em etapas, autenticacao, painel administrativo e API desacoplada.

## Stack

- Frontend: React + Vite + TypeScript + TailwindCSS
- Backend: Node.js + Express (arquitetura serverless ready)
- Banco: TiDB Cloud (MySQL protocol)
- Autenticacao: JWT + hash de senha com bcrypt
- Deploy: pronto para Vercel e Netlify

## Funcionalidades Implementadas

### Cliente
- Cadastro, login e recuperacao de senha por email
- Home com botoes de navegacao e dropdown de usuario
- Lista de servicos em cards
- Fluxo de agendamento em 5 etapas
- Validacao de horarios disponiveis
- Meus agendamentos com cancelamento

### Admin
- Login admin separado
- Dashboard com todos os agendamentos
- Filtro por data
- Busca por cliente
- Alteracao de status: pendente, confirmado, cancelado

### Regras e seguranca
- Bloqueio de conflito de horario (agendamentos duplicados)
- Sanitizacao de inputs
- Validacao de payloads com Zod
- Rate limit em autenticacao
- JWT em rotas protegidas

## Estrutura do Projeto

```txt
src/
  components/
  pages/
  services/
  hooks/
  utils/
  context/
server/
  config/
  middleware/
  routes/
  services/
  validators/
database/
  schema.sql
api/
  index.ts
netlify/functions/
  api.ts
```

## Como Rodar Localmente

1. Instale dependencias:

```bash
npm install
```

2. Configure variaveis de ambiente:

```bash
copy .env.example .env
```

3. Crie tabelas no TiDB usando:

- Arquivo: database/schema.sql

4. Execute frontend + backend:

```bash
npm run dev
```

5. Acesse:

- Frontend: http://localhost:5173
- API: http://localhost:8787/api/health

## Scripts

- npm run dev: frontend + backend
- npm run dev:client: apenas frontend
- npm run dev:server: apenas backend
- npm run lint: analise de qualidade
- npm run build: build de producao

## Deploy

### Vercel
- Build command: npm run build
- Output directory: dist
- API serverless: api/index.ts
- Config: vercel.json

### Netlify
- Build command: npm run build
- Publish directory: dist
- Function API: netlify/functions/api.ts
- Config: netlify.toml

## Integracao futura com WhatsApp

Ja existe servico preparado em src/services/whatsapp.service.ts para integrar Twilio, Z-API ou provedor equivalente.

## Observacoes de Manutencao

- Frontend e backend separados por responsabilidade
- Servicos reutilizaveis para facilitar escala
- Validacao centralizada com Zod
- Pronto para migrar API para repositorio dedicado, mantendo o frontend intacto
