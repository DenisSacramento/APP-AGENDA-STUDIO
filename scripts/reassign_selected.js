(async () => {
  const { createRequire } = await import('module')
  const require = createRequire(import.meta.url)
  const mysql = require('mysql2/promise')
  const dotenv = require('dotenv')
  dotenv.config()

  const mapping = {
    'Corte Feminino': 'Corte simples',
    'Coloracao': 'Coloração + hidratação',
  }

  const normalize = (s) => (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim()

  const host = process.env.TIDB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com'
  const port = Number(process.env.TIDB_PORT || 4000)
  const user = process.env.TIDB_USER || '4Ac5dJdUre4NDvh.root'
  const password = process.env.TIDB_PASSWORD || 'ZQAaBd2I1AcjFC2A'
  const database = process.env.TIDB_DATABASE || 'test'

  const pool = mysql.createPool({
    host, port, user, password, database,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
  })

  const [rows] = await pool.query('SELECT id, name FROM app_services')
  const normToId = new Map()
  const idToName = new Map()
  for (const r of rows) {
    normToId.set(normalize(r.name), r.id)
    idToName.set(r.id, r.name)
  }

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
    } catch (e) {
      await conn.rollback()
      console.error('Erro ao processar', srcName, e)
    } finally {
      conn.release()
    }
  }

  process.exit(0)
})().catch(e=>{console.error(e);process.exit(1)})
