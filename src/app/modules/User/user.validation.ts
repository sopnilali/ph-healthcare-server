import { Gender, UserStatus } from "@prisma/client";
import { z } from "zod";



const createAdminValidation = z.object({
    password: z.string({ required_error: "Password is required" }),
    admin: z.object({
        name: z.string({ required_error: "Name is reqired" }),
        email: z.string({ required_error: "Email is reqired" }),
        contactNumber: z.string({ required_error: "contactNumber is reqired" })
    })
})

const createDoctorValidation = z.object({
    password: z.string({ required_error: "Password is required" }),
    doctor: z.object({
        name: z.string({ required_error: "Name is reqired" }),
        email: z.string({ required_error: "Email is reqired" }),
        contactNumber: z.string({ required_error: "contactNumber is reqired" }),
        address: z.string({ required_error: "Address is reqired" }),
        registrationNumber: z.string({ required_error: "Registration Number is reqired" }),
        experience: z.number({ required_error: "Experience is reqired" }),
        gender: z.enum([Gender.MALE, Gender.FEMALE]),
        appointmentFee: z.number({ required_error: "Appointment Fee is reqired" }),
        qualification: z.string({ required_error: "Qualification is reqired" }),
        currentWorkingPlace: z.string({ required_error: "Current Working Place is reqired" }),
        designation: z.string({ required_error: "Designation is reqired" }),
    })
})

const createPatientValidation = z.object({
    password: z.string({ required_error: "Password is required" }),
    patient: z.object({
        name: z.string({ required_error: "Name is reqired" }),
        email: z.string({ required_error: "Email is reqired" }),
        contactNumber: z.string({ required_error: "contactNumber is reqired" }),
        address: z.string({ required_error: "Address is reqired" }),
    })
})

const updateStatusValidation = z.object({
    body: z.object({
        status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED])
    })
})

const updateAdminValidation = z.object({
    name: z.string({ required_error: "Name is reqired" }).optional(),
    email: z.string({ required_error: "Email is reqired" }).optional(),
    contactNumber: z.string({ required_error: "contactNumber is reqired" }).optional(),
    profilePhoto: z.string({ required_error: "contactNumber is reqired" }).optional(),
})



export const UserValidation = {
    createAdminValidation,
    createDoctorValidation,
    createPatientValidation,
    updateStatusValidation,
    updateAdminValidation
}