import {z} from 'zod'

export const usernameValidation = z
        .string()
        .min(5,"Username must be at least 5 characters")
        .max(20,"Username must be less than 20 characters")
        .regex(/^[a-zA-Z0-9._]{3,20}$/,"Username must not contain any special characters")

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password must be at least 6 characters"})
})
