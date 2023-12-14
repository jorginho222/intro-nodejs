import cors from 'cors'
const ACCEPTED_ORIGINS = [
  'http://localhost:63342',
  'http://localhost:8080',
  'http://lacamaragnola.com'
]

// le puedo pasar las options (host, allowed methods, accepted origins, etc) de afuera o de aca mismo
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    // origin es el sitio del front de donde sale la req. Si no esta definida, es porq el origen del front (dominio y puerto) es el mismo q el del back
    if (acceptedOrigins.includes(origin) || !origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
})
