import { Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination.type";
import { doctorSearchAbleFields } from "./doctor.constant";
import prisma from "../../utils/prisma";
import { IDoctorUpdate } from "./doctor.interface";

const GetAllDoctorIntoDB = async(filter: any, options: IPaginationOptions)=> {

    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filter

    console.log(specialties)

    const andCondition: Prisma.DoctorWhereInput[] = []
    
        if (filter.searchTerm) {
            andCondition.push({
                OR: doctorSearchAbleFields.map(field => ({
                    [field]: {
                        contains: filter.searchTerm,
                        mode: 'insensitive'
                    }
                }))
            })
        };

        // doctor > doctorSpecialities

        if(specialties && specialties.length > 0){
            andCondition.push({
                doctorSpecialties: {
                    some: {
                        specialities: {
                            title:{
                                contains: specialties,
                                mode: "insensitive"
                            }
                        }
                    }
                }
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
        andCondition.push({ isDeleted: false })
    
        const whereConditons: Prisma.DoctorWhereInput = { AND: andCondition }

        const result = await prisma.doctor.findMany({
            where: whereConditons,
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder ? {
                [options.sortBy]: options.sortOrder
            } : {
                createdAt: 'desc'
            },
            include: {
                doctorSpecialties: {
                    include: {
                        specialities: true
                    }
                }
            }
        });
    
        const total = await prisma.doctor.count({
            where: whereConditons
        });
    
        return {
            meta: {
                page,
                limit,
                total
            },
            data: result
        };

}

const getDoctorByIdIntoDB = async(id: string)=> {
    await prisma.doctor.findUniqueOrThrow({
        where: {id}
    })
    const result = await prisma.doctor.findUnique({
        where: {id}
    })
    return result
}

const updateIntoDB = async (id: string, payload: IDoctorUpdate) => {
    const { specialties, ...doctorData } = payload;

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    await prisma.$transaction(async (transactionClient) => {
        await transactionClient.doctor.update({
            where: {
                id
            },
            data: doctorData
        });

        if (specialties && specialties.length > 0) {
            // delete specialties
            const deleteSpecialtiesIds = specialties.filter(specialty   => specialty.isDeleted);
            //console.log(deleteSpecialtiesIds)
            for (const specialty of deleteSpecialtiesIds) {
                await transactionClient.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialty.specialtiesId
                    }
                });
            }

            // create specialties
            const createSpecialtiesIds = specialties.filter(specialty => !specialty.isDeleted);
            for (const specialty of createSpecialtiesIds) {
                await transactionClient.doctorSpecialties.create({
                    data: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialty.specialtiesId
                    }
                });
            }
        }
    })

    const result = await prisma.doctor.findUnique({
        where: {
            id: doctorInfo.id
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    })
    return result;
};

const deleteDoctorIntoDB = async(req: any)=> {
    const {id} = req.params

    await prisma.doctor.findFirstOrThrow({
        where: {id}
    })

    const result = await prisma.$transaction(async(transactionClient)=> {
        const verifyDoctor = await transactionClient.doctor.delete({
            where: {id}
        })

        await transactionClient.user.delete({
            where: {email: verifyDoctor.email}
        }) 
        return verifyDoctor

    })
    return result
}

const softDeleteDoctorIntoDB = async(req: any)=> {
    const {id} = req.params

    await prisma.doctor.findFirstOrThrow({
        where: {id}
    })

    const result = await prisma.$transaction(async(transactionClient)=> {
        const deleteVerify = await transactionClient.doctor.update({
            where: {id},
            data: {
                isDeleted: true
            }
        })

        await transactionClient.user.update({
            where: {email: deleteVerify.email},
            data: {
                status: UserStatus.DELETED
            }
        })
    })
    return result
}

export const DoctorServices = {
    GetAllDoctorIntoDB,
    getDoctorByIdIntoDB,
    updateIntoDB,
    deleteDoctorIntoDB,
    softDeleteDoctorIntoDB
}