const { z } = require('zod');

const registerUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required field" })
      .min(2, "The length should be more than 2")
      .trim(),

    email: z.string({ required_error: "Email is required field" })
      .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Invalid Email ID format")
      .trim()
      .min(6, "Please enter correct email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    role: z.enum(["user", "admin", "theatreOwner"], {
      errorMap: () => ({ message: "role must be user, admin, theatreOwner" })
    }).default('user'),

    ownedTheatres: z.array(z.string()).optional()
  })
});

const loginUserSchema = z.object({
  body: z.object({
    email: z.string({required_error: "Email is required field"}),
    password: z.string({required_error: "Password is required field"})
  })
})

module.exports = {registerUserSchema, loginUserSchema};