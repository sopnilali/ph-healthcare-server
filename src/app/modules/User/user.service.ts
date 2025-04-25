import { Prisma, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import prisma from "../../utils/prisma";
import { IFile } from "../../interface/file.type";
import { parse } from "path";
import { FileUploader } from "../../../helpers/fileUploader";
import { IPaginationOptions } from "../../interface/pagination.type";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { userSearchAbleFields } from "./user.constant";



const createAdminIntoDB = async (req: any) => {

    const file = req.file
    const data = req.body

    if (file) {
        const uploadData = await FileUploader.uploadToCloudinary(file)
        req.body.admin.profilePhoto = uploadData?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(data.password, 12)

    const userData = {
        email: data.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: data.admin
        });

        return createdAdminData;
    });

    return result;
};

const createDoctorIntoDB = async (req: any) => {

    const file = req.file
    const data = req.body

    if (file) {
        const uploadData = await FileUploader.uploadToCloudinary(file)
        req.body.doctor.profilePhoto = uploadData?.secure_url
    }


    const hashedPassword: string = await bcrypt.hash(data.password, 12)

    const userData = {
        email: data.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: data.doctor
        });

        return createdDoctorData;
    });

    return result;
};

const createPatientIntoDB = async (req: any) => {

    const file = req.file
    const data = req.body

    if (file) {
        const uploadData = await FileUploader.uploadToCloudinary(file)
        req.body.patient.profilePhoto = uploadData?.secure_url
    }
    const hashedPassword: string = await bcrypt.hash(data.password, 12)

    const userData = {
        email: data.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdPatientData = await transactionClient.patient.create({
            data: data.patient
        });

        return createdPatientData;
    });

    return result;
};

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options)
    const { searchTerm, ...filterData } = params

    const andCondition: Prisma.UserWhereInput[] = [];

    if (params.searchTerm) {
        andCondition.push({
            OR: userSearchAbleFields.map(filed => ({
                [filed]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditons: Prisma.UserWhereInput = andCondition.length > 0 ? { AND: andCondition } : {}

    const result = await prisma.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            patient: true,
            doctor: true
        }

    })
    const total = await prisma.user.count({
        where: whereConditons
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }

}

const changeProfileStatus = async (id: string, payload: UserRole) => {
    await prisma.user.findUniqueOrThrow({
        where: { id }
    })
    const updateUserStatus = await prisma.user.update({
        where: { id },
        data: payload
    })
    return updateUserStatus
}

const getmyProfileIntoDB = async (user: IAuth) => {
    const userprofile = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            needPasswordChange: true,

        }
    })

    let profileInfo
    if (userprofile.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: user.email
            }
        })
    } else if (userprofile.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: user.email
            }
        })
    } else if (userprofile.role === UserRole.DOCTOR) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: user.email
            }
        })
    } else if (userprofile.role === UserRole.PATIENT) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: user.email
            }
        })
    }
    return { ...userprofile, ...profileInfo }

}


const updateMyProfile = async (user: IAuth, req: any) => {

    const file = req.file as IFile

    if(file){
        const uploadData = await FileUploader.uploadToCloudinary(file)
        req.body.profilePhoto = uploadData?.secure_url
    }


    const verifyUser = await prisma.user.findUniqueOrThrow({
        where: { email: user.email, status: UserStatus.ACTIVE }
    })

    let userInfo
    if (verifyUser.role === UserRole.ADMIN) {
        userInfo = await prisma.admin.update({
            where: { email: verifyUser.email },
            data: req.body
        })
    } else if (verifyUser.role === UserRole.SUPER_ADMIN) {
        userInfo = await prisma.admin.update({
            where: { email: verifyUser.email },
            data: req.body
        })
    } else if (verifyUser.role === UserRole.DOCTOR) {
        userInfo = await prisma.doctor.update({
            where: { email: verifyUser.email },
            data: req.body
        })
    } else if (verifyUser.role === UserRole.PATIENT) {
        userInfo = await prisma.patient.update({
            where: { email: verifyUser.email },
            data: req.body
        })
    }

    return userInfo

}


export const userServices = {
    createAdminIntoDB,
    createDoctorIntoDB,
    createPatientIntoDB,
    getAllFromDB,
    changeProfileStatus,
    getmyProfileIntoDB,
    updateMyProfile
}