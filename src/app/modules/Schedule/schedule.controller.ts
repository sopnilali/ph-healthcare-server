import { Request } from "express";
import pick from "../../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paginationFields, ScheduleSearchAbleFields } from "./schedule.constant";
import { ScheduleService } from "./schedule.service";



const InsertSchedule = catchAsync(async(req, res)=> {
    const result = await ScheduleService.InsertIntoDB(req.body)
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Schadue create Successfully!",
        data: result
    })
})

const GetAllData = catchAsync(async(req, res)=> {

        
    const filter = pick(req.query, ScheduleSearchAbleFields)
    const Options = pick(req.query, paginationFields)
    const user = req.user

    const result = await ScheduleService.getAllScheduleFromDB(filter, Options, user);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Schadules fetch Successfully!",
        data: result
    })
})

const GetByIdData = catchAsync(async(req, res)=> {

    const {id} = req.params
    const result = await ScheduleService.getByIdIntoDB(id);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Schadule fetch Successfully!",
        data: result
    })
})

const DeleteScheduleData = catchAsync(async(req, res)=> {

    const {id} = req.params
    await ScheduleService.deleteScheduleIntoDB(id);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Schadule delete Successfully!"
    })
})




export const ScheduleController = {
    InsertSchedule,
    GetAllData,
    GetByIdData,
    DeleteScheduleData
}