const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./schemas/moviesSchema')

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:63342',
      'http://localhost:8080',
      'http://lacamaragnola.com'
    ]
    // origin es el sitio del front de donde sale la req. Si no esta definida, es porq el origen del front (dominio y puerto) es el mismo q el del back
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}))

// CORS PRE-Flight (OPTIONS)
// métodos normales: GET/HEAD/POST, no necesito pasar OPTIONS
// métodos complejos: PUT/PATCH/DELETE, tengo q pasar options (abajo en app.options)

app.get('/', (req, res) => {
  res.json({ message: 'holu' })
})

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const byGenre = movies.filter(movie => movie.genre.some(movieGenre => movieGenre.toLowerCase() === genre.toLowerCase()))
    if (byGenre.length > 0) return res.json(byGenre)
    res.status(404).json({ message: `No Movie with genre ${genre} was found` })
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const validation = validateMovie(req.body)

  if (validation.error) {
    return res.status(400).json({ error: JSON.parse(validation.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...validation.data
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not Found' })
  }
  movies.splice(movieIndex, 1)
  return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const validation = validatePartialMovie(req.body)
  if (!validation.success) {
    return res.status(400).json({ error: JSON.parse(validation.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie Not Found' })
  }
  const updatedMovie = {
    ...movies[movieIndex],
    ...validation.data
  } // todo lo q ya tenia la pelicula seleccionada mas los atributos actualizados
  movies[movieIndex] = updatedMovie
  return res.json(updatedMovie)
})

// no hace falta, con el modulo corse de node lo puedo hacer mas facil. Aunq aca puedo personalizar que metodos tengo permitidos por ej
// app.options('/movies/:id', (req, res) => {
//   const origin = req.header('origin')
//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE') // metodos permitidos
//   }
//   res.send()
// })

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
