import httpStatus from "http-status";
import prisma from "../../utils/prisma"
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../interface/pagination.type";
import AppError from "../../errors/AppError";

const InsertIntoDB = async (user: any, payload: {
    scheduleIds: string[]
}) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }))

    const result = await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    });

    return result;
};

const getMySchedule = async (
    filters: any,
    options: IPaginationOptions,
    user: any
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;
    console.log(filterData)

    const andConditions = [];

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDate
                        }
                    }
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDate
                        }
                    }
                }
            ]
        })
    };


    if (Object.keys(filterData).length > 0) {

        if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true
        }
        else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false
        }

        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    const whereConditions: Prisma.DoctorSchedulesWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};


        const doctorInfo = await prisma.doctor.findUnique({
            where: {
                email: user?.email
            }
        })



    const result = await prisma.doctorSchedules.findMany({
        where: {
            ...whereConditions,
            doctorId: doctorInfo?.id
        },
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {

                }
    });
    const total = await prisma.doctorSchedules.count({
        where: {
            ...whereConditions,
            doctorId: doctorInfo?.id
        },
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};
const getAllFromDB = async (
    filters: any,
    options: IPaginationOptions,
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            doctor: {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true;
        } else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false;
        }
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        });
    }

    const whereConditions: any =
        andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma.doctorSchedules.findMany({
        include: {
            doctor: true,
            schedule: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {},
    });
    const total = await prisma.doctorSchedules.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
}

const deleteFromDB = async (user: any, scheduleId: string) => {

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    const isBookedSchedule = await prisma.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId: scheduleId,
            isBooked: true
        }
    });

    if (isBookedSchedule) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can not delete the schedule because of the schedule is already booked!")
    }

    const result = await prisma.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleId
            }
        }
    })
    return result;

}



export const DoctorScheduleServices = {
    InsertIntoDB,
    getMySchedule,
    getAllFromDB,
    deleteFromDB
}