import { createApp } from './app.js'
import { Movie } from './models/local-file-system/Movie.js'

createApp({ movieModel: Movie })
