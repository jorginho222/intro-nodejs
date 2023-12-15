import express from 'express'
import logger from 'morgan'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

const port = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})
const db = createClient({
  url: 'libsql://internal-monster-badoon-jorginho222.turso.io',
  authToken: process.env.DB_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER(PRIMARY KEY AUTOINCREMENT)
  )
`)

io.on('connection', (socket) => {
  console.log('A user has connected!')

  socket.on('disconnect', () => {
    console.log('An user has disconnected')
  })

  socket.on('user message sent', (msg) => {
    // mandamos a todos los clientes el msg q el usuario de uno de ellos escribio
    io.emit('broadcast message', msg)
  })
})

app.use(logger('dev')) // aparece el log en la terminal (monitorea las peticiones, errores, etc)

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
