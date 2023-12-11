const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie } = require('./schemas/movies')

const app = express()
app.disable('x-powered-by')
app.use(express.json())

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

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
