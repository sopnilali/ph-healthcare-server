
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";
import httpStatus from "http-status";


const CreateAdmin = catchAsync(async(req, res)=> {
    const result = await userServices.createAdmin(req.body);

    sendResponse(res, {
        success: true,
        message: 'Create Admin Successfully',
        statusCode: httpStatus.CREATED,
        data: result
    })

})

export const userController = {
    CreateAdmin
}