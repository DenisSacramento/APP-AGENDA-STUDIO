import { app } from './app'
import { initDatabase } from './config/db'
import { env } from './config/env'

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
