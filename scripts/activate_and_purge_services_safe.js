(async () => {
  const { createRequire } = await import('module')
  const require = createRequire(import.meta.url)
  const mysql = require('mysql2/promise')
  const dotenv = require('dotenv')
  dotenv.config()

  const OFFICIAL = [
    'Corte simples','Corte long bob/Chanel','Progressiva P e M','Progressiva G','Coloração + hidratação','Escova simples Mega Hair','Escova Mega Hair + hidratação','Hidroreconstrução','Hidronutrição + finalização','Escova + hidratação','Escova simples','Botox a partir de','Reconstrução','Selagem a partir de','Cristalização','Cauterização','Cronograma capilar (4 sessões)'
  ]
  const normalize = (s) => (s||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/\s+/g,' ').trim()
  const officialNorm = new Set(OFFICIAL.map(normalize))

  const host = process.env.TIDB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com'
  const port = Number(process.env.TIDB_PORT || 4000)
  const user = process.env.TIDB_USER || '4Ac5dJdUre4NDvh.root'
  const password = process.env.TIDB_PASSWORD || 'ZQAaBd2I1AcjFC2A'
  const database = process.env.TIDB_DATABASE || 'test'

  const db = await mysql.createPool({
    host, port, user, password, database,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
  })

  // Buscar todos os serviços
  const [rows] = await db.query('SELECT id,name,is_active FROM app_services')
  // Mapear oficiais por nome normalizado
  const officialMap = new Map()
  for (const r of rows) {
    const n = normalize(r.name)
    if (officialNorm.has(n)) officialMap.set(n, r.id)
  }
  let ativados = 0, deletados = 0, reatribuicoes = 0
  for (const r of rows) {
    const n = normalize(r.name)
    if (officialNorm.has(n)) {
      if (r.is_active !== 1) {
        await db.query('UPDATE app_services SET is_active = 1 WHERE id = ?', [r.id])
        ativados++
      }
    } else {
      // Se houver oficial equivalente, reatribuir agendamentos
      const idOficial = officialMap.get(n)
      if (idOficial) {
        const [result] = await db.query('UPDATE app_appointments SET service_id = ? WHERE service_id = ?', [idOficial, r.id])
        if (result.affectedRows > 0) reatribuicoes += result.affectedRows
      }
      // Agora pode deletar
      await db.query('DELETE FROM app_services WHERE id = ?', [r.id])
      deletados++
    }
  }
  console.log(`Ativados: ${ativados}, Deletados não-oficiais: ${deletados}, Reatribuídos: ${reatribuicoes}`)
  process.exit(0)
})().catch(e=>{console.error(e);process.exit(1)})
