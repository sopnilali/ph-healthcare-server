"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const updateDoctorValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }).optional(),
        profilePhoto: zod_1.z.string().optional(),
        contactNumber: zod_1.z.string().min(1, { message: "Contact number is required" }).optional(),
        address: zod_1.z.string().min(1, { message: "Address is required" }).optional(),
        registrationNumber: zod_1.z.string().min(1, { message: "Registration number is required" }).optional(),
        experience: zod_1.z.number().int().nonnegative({ message: "Experience must be a non-negative integer" }).optional(),
        gender: zod_1.z.enum([client_1.Gender.MALE, client_1.Gender.FEMALE]).optional(),
        appointmentFee: zod_1.z.number().int().positive({ message: "Appointment fee must be a positive integer" }).optional(),
        qualification: zod_1.z.string().min(1, { message: "Qualification is required" }).optional(),
        currentWorkingPlace: zod_1.z.string().min(1, { message: "Current working place is required" }).optional(),
        designation: zod_1.z.string().min(1, { message: "Designation is required" }).optional()
    })
});
exports.DoctorValidation = {
    updateDoctorValidation
};
