import z from 'zod'

const updateAdminValidation = z.object({
    body: z.object({
        name: z.string().optional(),
        contactNumber: z.string().optional()
    })
})

export const adminValidationSchema = {
    updateAdminValidation
}