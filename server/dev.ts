import { app } from './app.js'
import { initDatabase } from './config/db.js'
import { env } from './config/env.js'

initDatabase()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`API running at http://localhost:${env.port}`)
    })
  })
  .catch((error) => {
    console.error('Database initialization failed', error)
    process.exit(1)
  })

