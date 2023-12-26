import mysql from 'mysql2/promise.js'
import { dbConfig } from './config.js'

const connection = mysql.createConnection(dbConfig)

export class Movie {
  static async getAll (genre) {
    if (genre) {
      const movieGenre = genre.toLowerCase()
      const [movies] = await (await connection).query(
        'SELECT title, year, director, duration, poster, rate FROM movies ' +
        'INNER JOIN movies_genres mg on movies.id = mg.movie_id ' +
        'INNER JOIN genres g on mg.genre_id = g.id ' +
        'WHERE g.name = ? ;', [movieGenre]
      ) // inserto variables donde haya "?" (en orden en array). Nunca usar ${variable}, porq es susceptible a la inyeccion de SQL
      return movies
    }

    // hacemos desconstructing ya q la query me devuelve una tupla [resultado, tableInfo]
    const [movies] = await (await connection).query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id FROM movies;'
    )
    return movies
  }

  static async getById (id) {
    const [movie] = await (await connection).query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movies ' +
      'WHERE id = UUID_TO_BIN(?);',
      [id]
    )
    if (movie.length > 0) return movie[0]
    return false
  }

  static async create (validated) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      rate
    } = validated

    const [uuidResult] = await (await connection).query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await (await connection).query(
        'INSERT INTO movies (id, title, year, director, duration, poster, rate) ' +
        'VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)',
        [uuid, title, year, director, duration, poster, rate]
      )
    } catch (e) {
      // evitar mandar info sensible, solamente un msj de error
      throw new Error('Error al crear la pelicula')
      // enviar el error detallado a un serv interno
    }

    validated.id = uuid
    return validated
  }

  static async update ({ id, validatedAttrs }) {
    let setFields = ''
    let isRateAttribute = false
    Object.entries(validatedAttrs.data).forEach(movieAttr => {
      const [key, value] = movieAttr
      if (key === 'rate') {
        isRateAttribute = true
        return
      }
      setFields += key + ' = ' + value + ', '
    })
    setFields = setFields.substring(0, setFields.length - 2) // remove comma at final

    await (await connection).query(
      'UPDATE movies SET ' + setFields + ' WHERE movies.id = UUID_TO_BIN(?);', [id]
    )
    if (isRateAttribute) {
      await this.rate(id, validatedAttrs.data.rate)
    }

    // recuperar movie
    const [movie] = await (await connection).query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movies ' +
      'WHERE id = UUID_TO_BIN(?);',
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
      'SELECT rate FROM movies WHERE id = UUID_TO_BIN(?)',
      [id]
    )
    if (movie.length === 0) return false
    const averageRate = (currentRate + parseFloat(movie[0].rate)) / 2
    await (await connection).query(
      'UPDATE movies SET rate = ? WHERE id = UUID_TO_BIN(?)',
      [averageRate, id]
    )
  }
}
