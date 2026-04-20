(async()=>{
  const { createRequire } = await import('module')
  const require = createRequire(import.meta.url)
  const mysql = require('mysql2/promise')

  const OFFICIAL = [
    'Corte simples','Corte long bob/Chanel','Progressiva P e M','Progressiva G','Coloração + hidratação','Escova simples Mega Hair','Escova Mega Hair + hidratação','Hidroreconstrução','Hidronutrição + finalização','Escova + hidratação','Escova simples','Botox a partir de','Reconstrução','Selagem a partir de','Cristalização','Cauterização','Cronograma capilar (4 sessões)'
  ]

  const normalize = (s) =>
    s
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()

  const officialNorm = new Set(OFFICIAL.map(normalize))

  const db = await mysql.createPool({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '4Ac5dJdUre4NDvh.root',
    password: 'ZQAaBd2I1AcjFC2A',
    database: 'test',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
  })

  const [rows] = await db.query('SELECT id,name,is_active FROM app_services')

  for (const r of rows) {
    const n = normalize(r.name)
    const shouldBeActive = officialNorm.has(n)
    if ((r.is_active === 1) !== shouldBeActive) {
      await db.query('UPDATE app_services SET is_active = ? WHERE id = ?', [shouldBeActive ? 1 : 0, r.id])
      console.log(`Updated id:${r.id} name:"${r.name}" -> is_active=${shouldBeActive?1:0}`)
    }
  }

  console.log('Done')
  process.exit(0)
})().catch(e=>{console.error(e);process.exit(1)})
