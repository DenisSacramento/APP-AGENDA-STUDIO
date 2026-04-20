(async () => {
  const { createRequire } = await import('module')
  const require = createRequire(import.meta.url)
  const mysql = require('mysql2/promise')
  const fs = require('fs')
  const path = require('path')
  const dotenv = require('dotenv')
  dotenv.config()

  const OFFICIAL_SERVICES = [
    { name: 'Corte simples', description: 'Corte simples com acabamento.', durationMinutes: 45, price: 35 },
    { name: 'Corte long bob/Chanel', description: 'Corte long bob ou chanel com finalização.', durationMinutes: 60, price: 40 },
    { name: 'Progressiva P e M', description: 'Progressiva para cabelos de comprimento pequeno e médio.', durationMinutes: 180, price: 150 },
    { name: 'Progressiva G', description: 'Progressiva para cabelos longos e volumosos.', durationMinutes: 210, price: 200 },
    { name: 'Coloração + hidratação', description: 'Coloração com hidratação para brilho e maciez.', durationMinutes: 120, price: 65 },
    { name: 'Escova simples Mega Hair', description: 'Escova simples para Mega Hair.', durationMinutes: 60, price: 70 },
    { name: 'Escova Mega Hair + hidratação', description: 'Escova para Mega Hair com hidratação.', durationMinutes: 80, price: 80 },
    { name: 'Hidroreconstrução', description: 'Tratamento de hidroreconstrução.', durationMinutes: 75, price: 70 },
    { name: 'Hidronutrição + finalização', description: 'Hidronutrição com finalização completa.', durationMinutes: 75, price: 70 },
    { name: 'Escova + hidratação', description: 'Escova com hidratação para alinhamento e brilho.', durationMinutes: 60, price: 50 },
    { name: 'Escova simples', description: 'Escova simples com acabamento.', durationMinutes: 45, price: 40 },
    { name: 'Botox a partir de', description: 'Tratamento botox capilar. Valor inicial.', durationMinutes: 120, price: 90 },
    { name: 'Reconstrução', description: 'Reconstrução capilar intensiva.', durationMinutes: 90, price: 80 },
    { name: 'Selagem a partir de', description: 'Selagem capilar. Valor inicial.', durationMinutes: 120, price: 100 },
    { name: 'Cristalização', description: 'Cristalização para brilho e alinhamento.', durationMinutes: 90, price: 75 },
    { name: 'Cauterização', description: 'Cauterização capilar para reposição de massa.', durationMinutes: 90, price: 80 },
    { name: 'Cronograma capilar (4 sessões)', description: 'Pacote com 4 sessões de cronograma capilar.', durationMinutes: 240, price: 200 },
  ]

  const normalize = (s) =>
    (s || '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()

  const officialMap = new Map(OFFICIAL_SERVICES.map((s) => [normalize(s.name), s]))

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

  // backup
  const [allRows] = await pool.query('SELECT * FROM app_services')
  const backupPath = path.join('scripts', `app_services_backup_${Date.now()}.json`)
  fs.writeFileSync(backupPath, JSON.stringify(allRows, null, 2), 'utf8')
  console.log('Backup salvo em', backupPath)

  // agrupar por nome normalizado
  const groups = new Map()
  for (const r of allRows) {
    const n = normalize(r.name)
    if (!groups.has(n)) groups.set(n, [])
    groups.get(n).push(r)
  }

  const summary = { updated: [], merged: [], deleted: [], skipped: [] }

  for (const [norm, rows] of groups) {
    const canonical = officialMap.get(norm)

    if (!canonical) {
      // grupo não oficial: não deletamos automaticamente, apenas deixamos como está
      summary.skipped.push({ norm, count: rows.length })
      continue
    }

    // escolher a linha a manter: preferir a que já tem o nome canônico, senão a que contém acento, senão a primeira
    let keep = rows.find((r) => r.name === canonical.name)
    if (!keep) {
      keep = rows.find((r) => {
        const ascii = (r.name || '').normalize('NFD').replace(/\p{Diacritic}/gu, '')
        return ascii !== (r.name || '')
      })
    }
    if (!keep) keep = rows[0]

    // começar transação por grupo
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      // atualizar dados canônicos na linha que vamos manter
      const needsUpdate =
        (keep.name !== canonical.name) ||
        String(keep.description || '') !== String(canonical.description || '') ||
        Number(keep.duration_minutes || keep.durationMinutes || 0) !== Number(canonical.durationMinutes || 0) ||
        Number(keep.price || 0) !== Number(canonical.price || 0)

      if (needsUpdate) {
        await conn.query(
          'UPDATE app_services SET name = ?, description = ?, duration_minutes = ?, price = ? WHERE id = ?',
          [canonical.name, canonical.description, canonical.durationMinutes, canonical.price, keep.id],
        )
        summary.updated.push({ id: keep.id, to: canonical.name })
      }

      // para as demais linhas, reatribuir agendamentos e deletar
      for (const r of rows) {
        if (r.id === keep.id) continue
        await conn.query('UPDATE app_appointments SET service_id = ? WHERE service_id = ?', [keep.id, r.id])
        await conn.query('DELETE FROM app_services WHERE id = ?', [r.id])
        summary.merged.push({ from: r.id, name: r.name, to: keep.id })
        summary.deleted.push(r.id)
      }

      await conn.commit()
    } catch (e) {
      await conn.rollback()
      console.error('Erro no grupo', norm, e)
    } finally {
      conn.release()
    }
  }

  console.log('\nResumo:')
  console.log('Atualizados (nome/descrição):', summary.updated)
  console.log('Mesclados (ids deletados -> id mantido):', summary.merged)
  console.log('Pulados (não oficiais):', summary.skipped.slice(0, 20))
  console.log('\nOperação concluída')
  process.exit(0)
})().catch((e) => { console.error(e); process.exit(1) })
