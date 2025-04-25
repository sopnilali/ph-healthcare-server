import pick from "../../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { doctorFilterableFields, paginationFields } from "./doctor.constant";
import { DoctorServices } from "./doctor.service";
import httpStatus from "http-status";


const GetAllDoctors = catchAsync(async(req, res)=> {

    
    const filter = pick(req.query, doctorFilterableFields)
    const Options = pick(req.query, paginationFields)


    const result = await DoctorServices.GetAllDoctorIntoDB(filter, Options)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctors Retrived Successfully!",
        data: result
    })
})

const getDoctorById = catchAsync(async(req, res)=> {
    const {id}= req.params
    const result = await DoctorServices.getDoctorByIdIntoDB(id)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctor Retrived Successfully!",
        data: result
    })
})

const updateDoctor = catchAsync(async(req, res)=> {
    const {id}= req.params
    const result = await DoctorServices.updateIntoDB(id, req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctor Retrived Successfully!",
        data: result
    })
})

const deleteDoctor = catchAsync(async(req, res)=> {
    await DoctorServices.deleteDoctorIntoDB(req)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctor Delete Successfully!"
    })
})

const SoftdeleteDoctor = catchAsync(async(req, res)=> {
    await DoctorServices.softDeleteDoctorIntoDB(req)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctor Delete Successfully!"
    })
})


export const DoctorController = {
    GetAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    SoftdeleteDoctor
}