const http = require('node:http')
const { findAvailablePort } = require('./11.free-port')

const desiredPort = process.env.PORT ?? 3000
const server = http.createServer((req, res) => {
  console.log('request received')
  res.end('hola mondo')
})

findAvailablePort(desiredPort).then(port => {
  server.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`)
  })
})
