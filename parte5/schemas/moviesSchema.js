import z from 'zod'

const moviesSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().positive().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum([
      'Animation',
      'Adventure',
      'Drama',
      'Sci-Fi',
      'Crime',
      'Romance',
      'Biography',
      'Fantasy',
      'Thriller'
    ], {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be one of the genres list'
    })
  )
})

function validateMovie (input) {
  return moviesSchema.safeParse(input) // safe parse me tira los errores en caso q falle la validacion
}

function validatePartialMovie (input) {
  return moviesSchema.partial().safeParse(input)
}

export {
  validateMovie, validatePartialMovie
}
