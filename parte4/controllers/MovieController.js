import { Movie } from '../models/database/Movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/moviesSchema.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await Movie.getAll(genre)
    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await Movie.getById(id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
  }

  static async create (req, res) {
    const validatedMovie = validateMovie(req.body)
    if (validatedMovie.error) {
      // tambien podria mandarse err 422
      return res.status(400).json({ error: JSON.parse(validatedMovie.error.message) })
    }
    const createdMovie = await Movie.create({ input: validatedMovie.data })

    res.status(201).json(createdMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const wasFound = await Movie.delete(id)
    if (!wasFound) {
      return res.status(404).json({ message: 'Movie not Found' })
    }
    return res.json({ message: 'Movie deleted' })
  }

  static async patch (req, res) {
    const validatedAttrs = validatePartialMovie(req.body)
    if (!validatedAttrs.success) {
      return res.status(400).json({ error: JSON.parse(validatedAttrs.error.message) })
    }

    const { id } = req.params
    const updatedMovie = await Movie.update({ id, validatedAttrs })
    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie Not Found' })
    }

    return res.json(updatedMovie)
  }
}
