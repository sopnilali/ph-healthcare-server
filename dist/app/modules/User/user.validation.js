"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createAdminValidation = zod_1.z.object({
    password: zod_1.z.string({ required_error: "Password is required" }),
    admin: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is reqired" }),
        email: zod_1.z.string({ required_error: "Email is reqired" }),
        contactNumber: zod_1.z.string({ required_error: "contactNumber is reqired" })
    })
});
const createDoctorValidation = zod_1.z.object({
    password: zod_1.z.string({ required_error: "Password is required" }),
    doctor: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is reqired" }),
        email: zod_1.z.string({ required_error: "Email is reqired" }),
        contactNumber: zod_1.z.string({ required_error: "contactNumber is reqired" }),
        address: zod_1.z.string({ required_error: "Address is reqired" }),
        registrationNumber: zod_1.z.string({ required_error: "Registration Number is reqired" }),
        experience: zod_1.z.number({ required_error: "Experience is reqired" }),
        gender: zod_1.z.enum([client_1.Gender.MALE, client_1.Gender.FEMALE]),
        appointmentFee: zod_1.z.number({ required_error: "Appointment Fee is reqired" }),
        qualification: zod_1.z.string({ required_error: "Qualification is reqired" }),
        currentWorkingPlace: zod_1.z.string({ required_error: "Current Working Place is reqired" }),
        designation: zod_1.z.string({ required_error: "Designation is reqired" }),
    })
});
const createPatientValidation = zod_1.z.object({
    password: zod_1.z.string({ required_error: "Password is required" }),
    patient: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is reqired" }),
        email: zod_1.z.string({ required_error: "Email is reqired" }),
        contactNumber: zod_1.z.string({ required_error: "contactNumber is reqired" }),
        address: zod_1.z.string({ required_error: "Address is reqired" }),
    })
});
const updateStatusValidation = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([client_1.UserStatus.ACTIVE, client_1.UserStatus.BLOCKED, client_1.UserStatus.DELETED])
    })
});
const updateAdminValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is reqired" }).optional(),
    email: zod_1.z.string({ required_error: "Email is reqired" }).optional(),
    contactNumber: zod_1.z.string({ required_error: "contactNumber is reqired" }).optional(),
    profilePhoto: zod_1.z.string({ required_error: "contactNumber is reqired" }).optional(),
});
exports.UserValidation = {
    createAdminValidation,
    createDoctorValidation,
    createPatientValidation,
    updateStatusValidation,
    updateAdminValidation
};
