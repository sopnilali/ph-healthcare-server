import pick from "../../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paginationFields, patientFilterableFields } from "./patient.constant";
import { PatientServices } from "./patient.service";
import httpStatus from "http-status";

const GetAllPatient = catchAsync(async(req, res)=> {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, paginationFields)

    const result = await PatientServices.GetAllPatientIntoDB(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patients data fetched!",
        data: result
    })
})

const getPatientById = catchAsync(async(req, res)=> {
    const {id} = req.params
    const result = await PatientServices.getPatientByIdIntoDB(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient data fetched!",
        data: result
    })
})

const updatePatient = catchAsync(async(req, res)=> {
    const {id} = req.params
    const result = await PatientServices.updatePatientIntoDB(id, req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient data Update Successfull!",
        data: result
    })
})

const deletePatient = catchAsync(async(req, res)=> {
    const {id} = req.params
    const result = await PatientServices.deletePatientIntoDB(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient data Delete Successfull!",
        data: result
    })
})

const softdeletePatient = catchAsync(async(req, res)=> {
    const {id} = req.params
    const result = await PatientServices.softdeletePatientIntoDB(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Soft Patient data Delete Successfull!",
        data: result
    })
})

export const patientController = {
    GetAllPatient,
    getPatientById,
    updatePatient,
    deletePatient,
    softdeletePatient
}