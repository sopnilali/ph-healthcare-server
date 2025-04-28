import { addHours, addMinutes, format, } from "date-fns";
import prisma from "../../utils/prisma";
import { ISchedules } from "./schedule.interface";
import { IPaginationOptions } from "../../interface/pagination.type";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

const InsertIntoDB = async (payload: ISchedules) => {
    const { startDate, endDate, startTime, endTime } = payload

    const intervalTime = 30
    const schedules = [];

    const currentDate = new Date(startDate)
    const LastDate = new Date(endDate)

    while (currentDate <= LastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
            )
        )


        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])
            )
        )


        while (startDateTime < endDateTime) {
            const scheduleData = {
                startDateTime: startDateTime,
                endDateTime: addMinutes(startDateTime, intervalTime)
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            })

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                })
                schedules.push(result)
            }


            startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime)

        }
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return schedules


}

const getAllScheduleFromDB = async (filter: any, options: IPaginationOptions, user: any) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filter

    const andCondition: Prisma.ScheduleWhereInput[] = []

    if (startDate && endDate) {
        andCondition.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDate
                    }
                },
                {
                    endDateTime: {
                        lte: endDate
                    }
                }
            ]
        })
    };

    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditons: Prisma.ScheduleWhereInput = andCondition.length > 0 ? { AND: andCondition } : {}

    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user?.email
            }
        }
    })



    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId)


    const result = await prisma.schedule.findMany({
        where: {
            ...whereConditons,
            id: { notIn: doctorScheduleIds }
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {

        }
    });

    const total = await prisma.schedule.count({
        where: {
            ...whereConditons,
            id: { notIn: doctorScheduleIds }
        },
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

const getByIdIntoDB = async (id: string) => {
    const result = await prisma.schedule.findUniqueOrThrow({
        where: { id }
    })
    return result
}


const deleteScheduleIntoDB = async (id: string) => {

   const verifySchedule =  await prisma.doctorSchedules.findFirst({
        where: { scheduleId: id, isBooked: true }
    })

    if (verifySchedule) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can not delete the schedule because of the schedule is already booked!")
    }

    const result = await prisma.schedule.delete({
        where: { id }
    })
    return result
}



export const ScheduleService = {
    InsertIntoDB,
    getAllScheduleFromDB,
    getByIdIntoDB,
    deleteScheduleIntoDB
}