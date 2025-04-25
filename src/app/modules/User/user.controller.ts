
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";
import httpStatus from "http-status";
import { UserValidation } from "./user.validation";
import pick from "../../../shared/pick";
import { paginationFields, userFilterableFields } from "./user.constant";


const CreateAdmin = catchAsync(async(req, res)=> {
    
    const result = await userServices.createAdminIntoDB(req);

    sendResponse(res, {
        success: true,
        message: 'Create Admin Successfully',
        statusCode: httpStatus.CREATED,
        data: result
    })

})

const CreateDoctor = catchAsync(async(req, res)=> {

    const result = await userServices.createDoctorIntoDB(req);

    sendResponse(res, {
        success: true,
        message: 'Create Doctor Successfully',
        statusCode: httpStatus.CREATED,
        data: result
    })

})

const CreatePatient = catchAsync(async(req, res)=> {

    const result = await userServices.createPatientIntoDB(req);

    sendResponse(res, {
        success: true,
        message: 'Create Patient Successfully',
        statusCode: httpStatus.CREATED,
        data: result
    })

})

const getAllUserData = catchAsync(async(req, res)=> {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, paginationFields)

    const result = await userServices.getAllFromDB(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users data fetched!",
        meta: result.meta,
        data: result.data
    })
})

const updateUserStatus = catchAsync(async(req, res)=> {
    const {id} = req.params
    const result = await userServices.changeProfileStatus(id, req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users profile status changed!",
        data: result
    })
})

const getMyProfile = catchAsync(async(req, res)=> {
    const user = req.user
    const result = await userServices.getmyProfileIntoDB(user as IAuth)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile Fetched!",
        data: result
    })
})

const updateMyProfile = catchAsync(async(req, res)=> {
    const user = req.user
    const result = await userServices.updateMyProfile(user as IAuth, req);

    sendResponse(res, {
        success: true,
        message: "My Profile update successfully",
        statusCode: httpStatus.OK,
        data: result
    })
})

export const userController = {
    CreateAdmin,
    CreateDoctor,
    CreatePatient,
    getAllUserData,
    updateUserStatus,
    getMyProfile,
    updateMyProfile
}

