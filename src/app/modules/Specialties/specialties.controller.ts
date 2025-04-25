import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SpecialitiesService } from "./specialties.service";
import httpStatus from "http-status";

const createSpecialities = catchAsync(async (req, res) => {
    const result = await SpecialitiesService.createSpecialitiesIntoDB(req)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Specialities Created Successfully!",
        data: result
    })
})

const getAllSpecialities = catchAsync(async (req, res) => {
    const result = await SpecialitiesService.getAllSpecialitiesIntoDB()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Specialities All Fetch Successfully!",
        data: result
    })
})

const deteteSpecialities = catchAsync(async (req, res) => {
    const { id } = req.params
    await SpecialitiesService.deteteSpecialitiesIntoDB(id)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Specialities delete is Successfully!",
    })
})

export const SpecialitiesController = {
    createSpecialities,
    getAllSpecialities,
    deteteSpecialities
}