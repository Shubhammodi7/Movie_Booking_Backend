const { z } = require('zod');

const movieCreateSchema = z.object({
  name: z.string({required_error: "Name is required"})
    .trim()
    .min(1, "Name cannot be empty"),

  description: z.string({required_error: "Description is required"})
    .trim()
    .min(5, "Description should be more than 5 characters"),

  casts: z.array(z.string())
    .nonempty("One case is at least required"),

  trailerUrl: z.string({required_error: "Trailer URL is required"})
    .url(),

  language: z.array(z.string())
    .nonempty("Atleast one is required"),

  releaseDate: z.string({ required_error: "Release Date is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),

  director: z.string({required_error: "Director name is required"}),

  releaseStatus: z.enum(["RELEASED", "BLOCKED", "UNRELEASED"], {
    errorMap: () => ({message: "Status must be RELEASED, BLOCKED, UNRELEASED"})
  })
})

const movieUpdateSchema = movieCreateSchema.partial();

module.exports = { movieCreateSchema, movieUpdateSchema };