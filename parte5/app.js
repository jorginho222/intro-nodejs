import express from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

export const createApp = ({ movieModel }) => {
  const app = express()
  app.use(express.json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.get('/', (req, res) => {
    res.json({ message: 'holu' })
  })

  app.use('/movies', createMovieRouter({ movieModel })) // le pasamos el modelo q queremos (en este caso, el de la bdd de mysql)

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
  })
}
