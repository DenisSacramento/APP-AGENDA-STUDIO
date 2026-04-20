(async () => {
  const { createRequire } = await import('module')
  const require = createRequire(import.meta.url)
  const mysql = require('mysql2/promise')
  const dotenv = require('dotenv')
  dotenv.config()

  const OFFICIAL = [
    'Corte simples','Corte long bob/Chanel','Progressiva P e M','Progressiva G','Coloração + hidratação','Escova simples Mega Hair','Escova Mega Hair + hidratação','Hidroreconstrução','Hidronutrição + finalização','Escova + hidratação','Escova simples','Botox a partir de','Reconstrução','Selagem a partir de','Cristalização','Cauterização','Cronograma capilar (4 sessões)'
  ]

  const mapping = {
    'Manicure Premium': 'Escova simples'
  }

  const normalize = (s) =>
    (s || '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()

  const officialNorm = new Set(OFFICIAL.map(normalize))

  const host = process.env.TIDB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com'
  const port = Number(process.env.TIDB_PORT || 4000)
  const user = process.env.TIDB_USER || '4Ac5dJdUre4NDvh.root'
  const password = process.env.TIDB_PASSWORD || 'ZQAaBd2I1AcjFC2A'
  const database = process.env.TIDB_DATABASE || 'test'

  const pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
  })

  // carregar serviços atuais
  const [rows] = await pool.query('SELECT id,name FROM app_services')
  const normToId = new Map()
  const idToName = new Map()
  for (const r of rows) {
    normToId.set(normalize(r.name), r.id)
    idToName.set(r.id, r.name)
  }

  const results = { reassign: [], deleted: [], cleaned: [] }

  // aplicar mapeamentos
  for (const [srcName, dstName] of Object.entries(mapping)) {
    const srcNorm = normalize(srcName)
    const dstNorm = normalize(dstName)
    const srcId = normToId.get(srcNorm)
    const dstId = normToId.get(dstNorm)

    if (!srcId) {
      console.log(`Origem não encontrada: "${srcName}"`)
      continue
    }
    if (!dstId) {
      console.log(`Destino não encontrado: "${dstName}"`)
      continue
    }

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      const [resUpdate] = await conn.query('UPDATE app_appointments SET service_id = ? WHERE service_id = ?', [dstId, srcId])
      const [resDel] = await conn.query('DELETE FROM app_services WHERE id = ?', [srcId])
      await conn.commit()
      console.log(`Reatribuídos ${resUpdate.affectedRows} agendamento(s) de id:${srcId} ('${idToName.get(srcId)}') -> id:${dstId} ('${idToName.get(dstId)}'). Serviço antigo deletado.`)
      results.reassign.push({ from: srcId, to: dstId, moved: resUpdate.affectedRows })
      results.deleted.push(srcId)
    } catch (e) {
      await conn.rollback()
      console.error('Erro ao processar', srcName, e)
    } finally {
      conn.release()
    }
  }

  // remover quaisquer serviços não-oficiais que não tenham agendamentos
  const [rows2] = await pool.query(`
    SELECT s.id, s.name, s.is_active, COUNT(a.id) AS appointments
    FROM app_services s
    LEFT JOIN app_appointments a ON a.service_id = s.id
    GROUP BY s.id, s.name, s.is_active
    ORDER BY s.id
  `)

  for (const r of rows2) {
    const n = normalize(r.name)
    if (!officialNorm.has(n)) {
      if (Number(r.appointments) === 0) {
        await pool.query('DELETE FROM app_services WHERE id = ?', [r.id])
        console.log(`Deletado não-oficial sem agendamentos: id:${r.id} name="${r.name}"`)
        results.cleaned.push(r.id)
      } else {
        console.log(`Mantido não-oficial com agendamentos: id:${r.id} name="${r.name}" appointments=${r.appointments}`)
      }
    }
  }

  console.log('\nResumo final:')
  console.log(JSON.stringify(results, null, 2))
  process.exit(0)
})().catch((e) => { console.error(e); process.exit(1) })
