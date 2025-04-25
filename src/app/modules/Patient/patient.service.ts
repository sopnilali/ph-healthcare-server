import { Patient, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../utils/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { patientSearchAbleFields } from "./patient.constant";
import { IPaginationOptions } from "../../interface/pagination.type";
import { Request } from "express";
import { IPatientUpdate } from "./patient.interface";

const GetAllPatientIntoDB = async (filters: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options)
  const { searchTerm, ...filterData } = filters

  const andCondition: Prisma.PatientWhereInput[] = [];

  if (filters.searchTerm) {
    andCondition.push({
      OR: patientSearchAbleFields.map(filed => ({
        [filed]: {
          contains: filters.searchTerm,
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

  const whereConditons: Prisma.PatientWhereInput = andCondition.length > 0 ? { AND: andCondition } : {}

  const result = await prisma.patient.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOrder ? {
      [options.sortBy]: options.sortOrder
    } : {
      createdAt: 'desc'
    },
    include: {
      patientHealthData: true,
      medicalReport: true
    }

  })
  const total = await prisma.patient.count({
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

const getPatientByIdIntoDB = async (id: string) => {
  await prisma.patient.findUniqueOrThrow({
    where: { id }
  })
  const result = await prisma.patient.findUnique({
    where: { id },
    include: {
      patientHealthData: true,
      medicalReport: true
    }
  })
  return result
}

const updatePatientIntoDB = async (id: string, payload: Partial<IPatientUpdate>) => {

  const { patientHealthData, medicalReport, ...patientData } = payload;

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    }
  });

  await prisma.$transaction(async (transactionClient) => {
    //update patient data
    await transactionClient.patient.update({
      where: {
        id
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReport: true
      }
    });

    // create or update patient health data
    if (patientHealthData) {
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: patientInfo.id }
      });
    };

    if (medicalReport) {
      await transactionClient.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id }
      })
    }
  })


  const responseData = await prisma.patient.findUnique({
    where: {
      id: patientInfo.id
    },
    include: {
      patientHealthData: true,
      medicalReport: true
    }
  })
  return responseData


}


const deletePatientIntoDB = async(id: string)=>{
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {id}
  })

  const result = await prisma.$transaction(async(trx)=> {
    //delete medical report
    await trx.medicalReport.deleteMany({
      where: {
        patientId: patientInfo.id
      }
    })
    //delete patient health data
    await trx.patientHealthData.delete({
      where: {patientId: patientInfo.id}
    })

    //delete patient data
    await trx.patient.delete({
      where: {id}
    })

    await trx.user.delete({
      where: {email: patientInfo.email}
    })
  })

  return result
}

const softdeletePatientIntoDB = async(id: string)=>{
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {id}
  })
  const result = await prisma.$transaction(async(trx)=> {

    //delete patient data
    await trx.patient.update({
      where: {id},
      data: {
        isDeleted: true
      }
    })

    await trx.user.update({
      where: {email: patientInfo.email},
      data: {
        status: UserStatus.DELETED
      }
    })
  })

  return result
}

export const PatientServices = {
  GetAllPatientIntoDB,
  getPatientByIdIntoDB,
  updatePatientIntoDB,
  deletePatientIntoDB,
  softdeletePatientIntoDB
}