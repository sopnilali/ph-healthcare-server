import { Request } from "express"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status";
import { DoctorScheduleServices } from "./doctorSchedulte.service"
import pick from "../../../shared/pick"
import { doctorScheduleSearchAbleFields, paginationFields } from "./doctorSchedule.constant"
import { IAuth } from "../../interface/common"

const InsertSchedule = catchAsync(async(req, res)=> {
    const user = req.user
    const result = await DoctorScheduleServices.InsertIntoDB(user, req.body)
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Doctor Schadule create Successfully!",
        data: result
    })
})

const GetMySchedule = catchAsync(async(req, res)=> {

        
    const filter = pick(req.query, doctorScheduleSearchAbleFields)
    const Options = pick(req.query, paginationFields)
    const user = req.user
    const result = await DoctorScheduleServices.getMySchedule(filter, Options, user as IAuth);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Schadules fetch Successfully!",
        data: result
    })
})
const getAllFromDB = catchAsync(async (req, res) => {
    const filter = pick(req.query, doctorScheduleSearchAbleFields)
    const Options = pick(req.query, paginationFields)
    const result = await DoctorScheduleServices.getAllFromDB(filter, Options);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Schadules fetch Successfully!",
        data: result
    })
})

const deleteFromDB = catchAsync(async (req, res) => {

    const user = req.user;
    const { id } = req.params;
    const result = await DoctorScheduleServices.deleteFromDB(user, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Schedule deleted successfully!",
        data: result
    });
});

export const DoctorScheduleController = {
    InsertSchedule,
    GetMySchedule,
    getAllFromDB,
    deleteFromDB
}