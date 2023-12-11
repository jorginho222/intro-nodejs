const http = require('node:http')
const desiredPort = process.env.PORT ?? 1234
const fs = require('node:fs')

const processRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (req.url === '/') {
    res.end('<h1>Bienvenido a la pág de inicio rey</h1>')
  } else if (req.url === '/imagen') {
    const filePath = './palabras.jpg'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.statusCode = 500
          res.end('<h1>500 No se encontró el archivo solicitado</h1>')
        }
        res.end('<h1>500 Internal server error</h1>')
      } else {
        res.setHeader('Content-Type', 'image/jpg')
        res.end(data)
      }
    })
  } else if (req.url === '/contacto') {
    res.end('<h1>Contacto</h1>')
  } else {
    res.statusCode = 404
    res.end('<h1>Página no encontrada (404)</h1>')
  }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`server listening on http://localhost:${desiredPort}`)
})
