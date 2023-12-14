import { validateMovie, validatePartialMovie } from '../schemas/moviesSchema.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getAll(genre)
    res.json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const movie = await this.movieModel.getById(id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
  }

  create = async (req, res) => {
    const validatedMovie = validateMovie(req.body)
    if (validatedMovie.error) {
      // tambien podria mandarse err 422
      return res.status(400).json({ error: JSON.parse(validatedMovie.error.message) })
    }
    const createdMovie = await this.movieModel.create({ input: validatedMovie.data })

    res.status(201).json(createdMovie)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const wasFound = await this.movieModel.delete(id)
    if (!wasFound) {
      return res.status(404).json({ message: 'Movie not Found' })
    }
    return res.json({ message: 'Movie deleted' })
  }

  patch = async (req, res) => {
    const validatedAttrs = validatePartialMovie(req.body)
    if (!validatedAttrs.success) {
      return res.status(400).json({ error: JSON.parse(validatedAttrs.error.message) })
    }

    const { id } = req.params
    const updatedMovie = await this.movieModel.update({ id, validatedAttrs })
    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie Not Found' })
    }

    return res.json(updatedMovie)
  }
}
