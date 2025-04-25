import { z } from "zod";

const createSpecialitiesValidation = z.object({
    title: z.string({required_error: "Title is Required", invalid_type_error: "Title must be String"})
})

export const SpecialitiesValidation = {
    createSpecialitiesValidation
}