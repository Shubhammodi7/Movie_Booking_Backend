const { z } = require('zod');

const theatreCreateSchema = z.object({
  name: z.string()
    .min(3, "Theatre name must be at least 3 characters"),

  description: z.string()
    .optional(),

  city: z.string()
    .min(2, "City name is required"),

  pinCode: z.number().int()
    .min(100000)
    .max(999999, "Invalid Indian PIN code"),

  address: z.string()
    .min(5, "Please provide a detailed address"),

    movies: z.array(z.string()).optional()
})

module.exports = {
  theatreCreateSchema
}

