import { createRequire } from 'node:module'
import crypto from 'node:crypto'
const require = createRequire(import.meta.url) // import.meta.url es la ruta actual de este archivo
const movies = require('../../movies.json')

export class MovieModel {
  static async getAll (genre) {
    if (genre) {
      return movies.filter(movie => movie.genre.some(movieGenre => movieGenre.toLowerCase() === genre.toLowerCase()))
    }
    return movies
  }

  static async getById (id) {
    return movies.find(movie => movie.id === id)
  }

  static async create ({ input }) {
    const movie = {
      id: crypto.randomUUID(),
      ...input
    }
    movies.push(movie)
    return movie
  }

  static async update ({ id, validatedAttrs }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...validatedAttrs.data
    }
    return movies[movieIndex]
  }

  static async delete (id) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex > -1) {
      movies.splice(movieIndex, 1)
      return true
    }
    return false
  }
}
