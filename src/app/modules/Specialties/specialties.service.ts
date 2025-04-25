import { Request } from "express"
import { FileUploader } from "../../../helpers/fileUploader"
import prisma from "../../utils/prisma"
import AppError from "../../errors/AppError"

const createSpecialitiesIntoDB = async(req: Request )=> {
    const file = req.file
    if(file){
        const uploadImage = await FileUploader.uploadToCloudinary(file)
        req.body.icon = uploadImage?.secure_url
    }

    const result = await prisma.specialties.create({
        data: req.body
    })
    return result
}

const getAllSpecialitiesIntoDB = async()=> {
    const result = await prisma.specialties.findMany();
    if(!result){
        throw new AppError(httpStatus.BAD_REQUEST, "Specialities Not Found")
    }
    return result

}

const deteteSpecialitiesIntoDB = async(id: string)=> {
    await prisma.specialties.findUniqueOrThrow({
        where: {id}
    })
    const result = await prisma.$transaction(async(transactionClient)=> {
        const deletedata = await transactionClient.specialties.delete({
            where: {id}
        })
        return deletedata
    })
    return result

} 
export const SpecialitiesService = {
    createSpecialitiesIntoDB,
    getAllSpecialitiesIntoDB,
    deteteSpecialitiesIntoDB
}