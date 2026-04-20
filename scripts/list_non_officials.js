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

  const db = await mysql.createPool({ host, port, user, password, database, ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false } })

  const [rows] = await db.query(`
    SELECT s.id, s.name, s.is_active, COUNT(a.id) AS appointments
    FROM app_services s
    LEFT JOIN app_appointments a ON a.service_id = s.id
    GROUP BY s.id, s.name, s.is_active
    ORDER BY s.id
  `)

  const nonOfficial = rows.filter(r => !officialNorm.has(normalize(r.name)))
  console.log('Total serviços:', rows.length)
  console.log('Serviços não-oficiais encontrados:', nonOfficial.length)
  if (nonOfficial.length > 0) {
    console.log('\nLista (id | name | is_active | appointments):')
    for (const r of nonOfficial) {
      console.log(`${r.id} | ${r.name} | is_active=${r.is_active} | appointments=${r.appointments}`)
    }
  }

  process.exit(0)
})().catch(e=>{console.error(e);process.exit(1)})
