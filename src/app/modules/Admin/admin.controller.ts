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
        message: "Admin data fetched!",
        meta: result.meta,
        data: result.data
    })
})

export const AdminController = {
    getAllFromDB
}