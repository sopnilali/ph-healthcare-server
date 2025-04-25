import pick from "../../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminSearchField } from "./admin.constant";
import { AdminServices } from "./admin.service";
import httpStatus from "http-status";

const getAllFromDB = catchAsync(async (req, res) => {
    // console.log(req.query)
    const filters = pick(req.query, adminSearchField);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await AdminServices.getAllUserIntoDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin users data fetched!",
        meta: result.meta,
        data: result.data
    })
})

const getAdminById = catchAsync(async(req, res)=> {
    const {id} = req.params
    const result = await AdminServices.getByIdIntoDB(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data fetched!",
        data: result
    })
})

const updateAdmin = catchAsync(async(req, res)=>{
    const {id} = req.params
    const result = await AdminServices.updateAdminIntoDB(id, req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data update successfully!",
        data: result
    })
})

const deleteAdmin = catchAsync(async(req, res)=> {
    const {id} = req.params
    await AdminServices.deleteAdminIntoDB(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin delete is successfully!"
    })
})

const softDeleteAdmin = catchAsync(async(req, res)=> {
    const {id} = req.params
    await AdminServices.softDeleteAdminIntoDB(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin delete is successfully!"
    })
})

export const AdminController = {
    getAllFromDB,
    getAdminById,
    updateAdmin,
    softDeleteAdmin,
    deleteAdmin
}