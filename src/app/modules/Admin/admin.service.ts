import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination.type";
import { IAdminFilterRequest } from "./admin.interface";
import { adminSearchField } from "./admin.constant";
import prisma from "../../utils/prisma";


const getAllUserIntoDB = async (params: IAdminFilterRequest, options: IPaginationOptions) => {

    const { page, limit, skip } = paginationHelper.calculatePagination(options);

    const { searchTerm, ...filterData } = params

    const andCondition: Prisma.AdminWhereInput[] = []

    if (params.searchTerm) {
        andCondition.push({
            OR: adminSearchField.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
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
    andCondition.push({ isDeleted: false })

    const whereConditons: Prisma.AdminWhereInput = { AND: andCondition }

    const result = await prisma.admin.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.admin.count({
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

export const AdminServices = {
    getAllUserIntoDB
}