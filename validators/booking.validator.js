const {z} = require('zod');


const bookingCreateSchema = z.object({
  show: z.string({required_error: "Show Id is required"}).regex(/^[0-9a-fA-F]{24}$/, "Invalid Show ID format")
    .trim()
    .min(4, "Enter the correct Show ID"),

  noOfSeats: z.number({required_error: "noOfSeats is required"})
    .min(1, "The noOfSeats should be more than 0"),

  paymentId: z.number({required_error: "paymentId is required"})
    .min(1, "The paymentId should be more than 0"),
})

const bookingUpdateSchema = z.object({
  show: z.string().optional(),
  noOfSeats: z.number().positive().optional(),
  paymentId: z.number().positive().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

module.exports = {
  bookingCreateSchema,
  bookingUpdateSchema
};
