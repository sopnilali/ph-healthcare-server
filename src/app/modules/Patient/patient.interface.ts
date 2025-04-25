import { BloodGroup, Gender, MaritalStatus } from "@prisma/client"

export interface IPatientUpdate {
    name: string
    contactNumber?: string
    address?: string;
    patientHealthData?: IPatientHealthData,
    medicalReport?: IMedicalReport
}

export interface IPatientHealthData {
    gender: Gender
    dateOfBirth: string
    bloodGroup: BloodGroup
    hasAllergies?: boolean
    hasDiabetes?: boolean
    height: string
    weight: string
    smokingStatus?: boolean
    dietaryPreferences?: string
    pregnancyStatus?: boolean
    mentalHealthHistory?: string
    immunizationStatus?: string
    hasPastSurgeries?: boolean
    recentAnxiety?: boolean
    recentDepression?: boolean
    maritalStatus?: MaritalStatus
}

interface IMedicalReport {
    reportName: string
    reportLink: string
}
