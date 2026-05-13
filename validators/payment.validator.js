const {z} = require('zod');

const paymentCreateSchema = z.object({
  booking: z.string({required_error: "Booking Id is required"}).regex(/^[0-9a-fA-F]{24}$/, "Invalid Booking ID format")
    .trim()
    .min(4, "Enter the correct Booking ID"),

  paymentMethod: z.enum(['CARD', 'UPI', 'NET_BANKING', 'WALLET'], {
      errorMap: () => ({message: "Payment Method should be - CARD, UPI,     NET_BANKING, WALLET - Only"})
    }),

  amount: z.number({required_error: "Amount should be in Number"})
        .min(1, "The amount should be more than 0"),

})

module.exports = {paymentCreateSchema}