import z from 'zod'

const moviesSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().positive().min(1900).max(2024),
  duration: z.number().int().positive(),
  rate: z.number().min(0, { message: 'El valor del rate debe ser entre 1 y 10' }).max(10, { message: 'El valor del rate debe ser entre 1 y 10' }),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  })
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
