 (async () => {
  const { createRequire } = await import('module')
  const require = createRequire(import.meta.url)
  const mysql = require('mysql2/promise')
  const names = [
    'Corte simples','Corte long bob/Chanel','Progressiva P e M','Progressiva G','Coloração + hidratação','Escova simples Mega Hair','Escova Mega Hair + hidratação','Hidroreconstrução','Hidronutrição + finalização','Escova + hidratação','Escova simples','Botox a partir de','Reconstrução','Selagem a partir de','Cristalização','Cauterização','Cronograma capilar (4 sessões)'
  ]

  const db = await mysql.createPool({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '4Ac5dJdUre4NDvh.root',
    password: 'ZQAaBd2I1AcjFC2A',
    database: 'test',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
  })

  for (const n of names) {
    const [rows] = await db.query('SELECT id,is_active,name FROM app_services WHERE name = ?', [n])
    if (rows.length > 0) {
      console.log('FOUND |', n, '|', rows.map(r => `id:${r.id} active:${r.is_active}`).join('; '))
    } else {
      console.log('MISSING |', n)
    }
  }
  process.exit(0)
})().catch(e => { console.error(e); process.exit(1) })
