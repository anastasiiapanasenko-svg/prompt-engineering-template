import 'dotenv/config'

import { app } from './app.js'
import { prisma } from './prisma.js'

const port = Number(process.env.PORT ?? 8001)

const server = app.listen(port, () => {
  console.log(`Recipe Generator API listening on port ${port}`)
})

const shutdown = async () => {
  server.close(async (error) => {
    await prisma.$disconnect()
    if (error) {
      console.error('Error while shutting down the API:', error)
      process.exitCode = 1
    }
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
