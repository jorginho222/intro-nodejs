import mysql from 'mysql2/promise.js'
import { dbConfig } from './config.js'

const connection = mysql.createConnection(dbConfig)
const eagerMovieQuery = 'SELECT title, year, d.name as directorName, genres.name as genreName, duration, poster, ' +
  'rate, BIN_TO_UUID(movies.id) as id FROM movies ' +
  'INNER JOIN movies_genres mg on movies.id = mg.movie_id ' +
  'INNER JOIN genres on mg.genre_id = genres.id ' +
  'LEFT JOIN directors d ON movies.directorId = d.id '

export class Movie {
  static async getAll () {
    // hacemos desconstructing ya q la query me devuelve una tupla [resultado, tableInfo]
    const [movies] = await (await connection).query(eagerMovieQuery)
    return movies
  }

  static async getById (id) {
    const [movie] = await (await connection).query(
      eagerMovieQuery + 'WHERE movies.id = UUID_TO_BIN(?);',
      [id]
    )
    if (movie.length > 0) return movie[0]
    return false
  }

  static async getByGenre (genre) {
    const movieGenre = genre.toLowerCase()
    const [movies] = await (await connection).query(
      eagerMovieQuery +
      'WHERE genres.name = ? ;', [movieGenre]
    ) // inserto variables donde haya "?" (en orden en array). Nunca usar ${variable}, porq es susceptible a la inyeccion de SQL
    return movies
  }

  static async getByDirector (directorId) {
    const [movie] = await (await connection).query(
      eagerMovieQuery +
      'WHERE directorId = UUID_TO_BIN(?);',
      [directorId]
    )
    if (movie.length > 0) return movie[0]
    return false
  }

  static async create (validated, genreId, directorId) {
    const {
      title,
      year,
      duration,
      poster
    } = validated

    const [uuidResult] = await (await connection).query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult
    try {
      await (await connection).query(
        'INSERT INTO movies (id, title, year, directorId, duration, poster) ' +
        'VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), ?, ?)',
        [uuid, title, year, directorId, duration, poster]
      )
      await (await connection).query(
        'INSERT INTO movies_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)',
        [uuid, genreId]
      )
    } catch (e) {
      console.log(e)
      // evitar mandar info sensible, solamente un msj de error
      throw new Error('Error al crear la pelicula')
      // enviar el error detallado a un serv interno
    }

    const [movie] = await (await connection).query(
      eagerMovieQuery + 'WHERE movies.id = UUID_TO_BIN(?);',
      [uuid]
    )
    return movie
  }

  static async update ({ id, validatedAttrs }) {
    let setFields = ''
    Object.entries(validatedAttrs.data).forEach(movieAttr => {
      const [key, value] = movieAttr
      setFields += key + ' = ' + value + ', '
    })
    setFields = setFields.slice(0, -2) // remove comma at final
    await (await connection).query(
      'UPDATE movies SET ' + setFields + ' WHERE movies.id = UUID_TO_BIN(?);', [id]
    )

    // recuperar movie
    const [movie] = await (await connection).query(
      eagerMovieQuery + 'WHERE movies.id = UUID_TO_BIN(?);',
      [id]
    )
    return movie
  }

  static async delete (id) {
    const wasFound = await this.getById(id)
    if (!wasFound) {
      return false
    }
    await (await connection).query(
      'DELETE FROM movies WHERE id = UUID_TO_BIN(?)',
      [id]
    )
    return true
  }

  static async rate (id, currentRate) {
    const [movie] = await (await connection).query(
      eagerMovieQuery + 'WHERE movies.id = UUID_TO_BIN(?);',
      [id]
    )
    console.log(movie)
    if (movie.length === 0) return false
    const averageRate = (currentRate + parseFloat(movie[0].rate)) / 2
    await (await connection).query(
      'UPDATE movies SET rate = ? WHERE id = UUID_TO_BIN(?)',
      [averageRate, id]
    )
  }
}
