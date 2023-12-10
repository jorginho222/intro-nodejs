const express = require('express')
const dittoJSON = require('./pokemon/ditto.json')

const app = express()
app.disable('x-powered-by')

app.use(express.json()) // haciendo lo mismo q comentado abajo
// app.use((req, res, next) => {
//   if (req.method !== 'POST') return next()
//   if (req.headers['content-type'] !== 'application/json') return next()
//
//   // Aqui solo llegan request q son POST y con header content-type: application/json
//   let body = ''
//   // Al escuchar el evento data...tomo cada "trozo" de esos datos (q en princ son binarios, o json) y los transf en string
//   req.on('data', chunk => {
//     body += chunk.toString()
//   })
//   req.on('end', () => {
//     const data = JSON.parse(body)
//     // mando la req con el body hacia la ruta POST correspondiente
//     req.body = data
//     next()
//   })
// })

const PORT = process.env.PORT ?? 1234

app.get('/pokemon/ditto', (req, res) => {
  res.json(dittoJSON)
})

app.post('/pokemon', (req, res) => {
  // logica con el req.body (ej. guardar en bdd)
  res.status(201).json(req.body)
})

// en caso de que la peticion no entre en ning de las anteriores
app.use((req, res) => {
  res.status(404).send('<h1>404 Not found</h1>')
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
