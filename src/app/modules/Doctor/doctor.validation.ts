import { Gender } from "@prisma/client";
import { z } from "zod";


const updateDoctorValidation = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().min(1, { message: "Contact number is required" }).optional(),
    address: z.string().min(1, { message: "Address is required" }).optional(),
    registrationNumber: z.string().min(1, { message: "Registration number is required" }).optional(),
    experience: z.number().int().nonnegative({ message: "Experience must be a non-negative integer" }).optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]).optional(),
    appointmentFee: z.number().int().positive({ message: "Appointment fee must be a positive integer" }).optional(),
    qualification: z.string().min(1, { message: "Qualification is required" }).optional(),
    currentWorkingPlace: z.string().min(1, { message: "Current working place is required" }).optional(),
    designation: z.string().min(1, { message: "Designation is required" }).optional()
  })
});

  export const DoctorValidation = {
    updateDoctorValidation
  }