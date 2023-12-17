import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { createClient } from '@libsql/client'

dotenv.config()
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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      user TEXT
  )
`)

io.on('connection', async (socket) => {
  console.log('A user has connected!')

  socket.on('disconnect', () => {
    console.log('An user has disconnected')
  })

  socket.on('user message sent', async (msg) => {
    let result
    const username = socket.handshake.auth.username ?? 'anonymous'
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, user) VALUES (:msg, :username)',
        args: { msg, username }
      })
    } catch (e) {
      console.error(e)
      return
    }

    // mandamos a todos los clientes el msg q el usuario de uno de ellos escribio
    io.emit('broadcasted message', msg, result.lastInsertRowid.toString(), username)
  })

  if (!socket.recovered) {
    try {
      const messages = await db.execute({
        sql: 'SELECT id, content, user FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      messages.rows.forEach(row => {
        socket.emit('broadcasted message', row.content, row.id.toString(), row.user)
      })
    } catch (e) {

    }
  }
})

app.use(logger('dev')) // aparece el log en la terminal (monitorea las peticiones, errores, etc)

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
