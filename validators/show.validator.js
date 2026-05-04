const {z} = require('zod');


const showCreateSchema = z.object({
  movie: z.string({required_error: "Movie Id is required"}).regex(/^[0-9a-fA-F]{24}$/, "Invalid Movie ID format")
    .trim()
    .min(4, "Enter the correct movie ID"),

  theatre: z.string({required_error: "theatre Id is required"}).regex(/^[0-9a-fA-F]{24}$/, "Invalid Theatre ID format")
    .trim()
    .min(4, "Enter the correct movie ID"),

  timings: z.coerce.date({
    required_error: "Timing is required",
    invalid_type_error: "Invalid date format. Expected ISO format (YYYY-MM-DDTHH:mm:ssZ)"
    }),

  price: z.number({required_error: "price is required"})
    .min(1, "The price should be more than 0"),

  format: z.enum(['2D', '3D', 'IMAX'], {
    errorMap: () => ({message: "Status must be 2D, 3D, IMAX"})
  }),

  language: z.string({required_error: "language is required"})
    .min(1).optional(),
  
  totalSeats: z.number({required_error: "totalSeats is required"})
    .min(1, "The totalSeats should be more than 0"),
})

const showUpdateSchema = z.object({
  movie: z.string().optional(),
  theatre: z.string().optional(),
  timings: z.string().datetime().optional(),
  price: z.number().positive().optional(),
  format: z.enum(['2D', '3D', 'IMAX']).optional(),
  language: z.string().min(2).optional(),
  availableSeats: z.number().int().nonnegative().optional(),
  totalSeats: z.number().int().positive().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

module.exports = {
  showCreateSchema,
  showUpdateSchema
};
