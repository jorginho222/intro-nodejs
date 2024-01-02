import { validateMovie, validatePartialMovie } from '../schemas/moviesSchema.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getMovies = async (req, res) => {
    const { genreName } = req.query
    const { directorId } = req.query
    let movies = []
    if (genreName) {
      movies = await this.movieModel.getByGenre(genreName)
    } else if (directorId) {
      movies = await this.movieModel.getByDirector(directorId)
    } else {
      movies = await this.movieModel.getAll()
    }
    if (movies) return res.json(movies)
    res.status(404).json({ message: 'Movie/s not found' })
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
    const createdMovie = await this.movieModel.create(validatedMovie.data, req.body.genreId, req.body.directorId)

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
    const updatedMovie = validatedAttrs.data.rate
      ? await this.movieModel.rate(id, validatedAttrs.data.rate)
      : await this.movieModel.update({ id, validatedAttrs })

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie Not Found' })
    }

    return res.json(updatedMovie)
  }
}
