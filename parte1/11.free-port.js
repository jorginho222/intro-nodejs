const net = require('node:net') // es el protocolo TCP (como http pero mas rapido, ya q no manda cabeceras por ej)

function findAvailablePort (desiredPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.listen(desiredPort, () => {
      const { port } = server.address()
      server.close(() => {
        resolve(port)
      })
    })

    server.on('error', err => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(0).then(port => resolve(port))
        return
      }
      reject(err)
    })
  })
}

module.exports = { findAvailablePort }
