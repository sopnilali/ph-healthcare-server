"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const user_constant_1 = require("./user.constant");
const CreateAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.createAdminIntoDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Create Admin Successfully',
        statusCode: http_status_1.default.CREATED,
        data: result
    });
}));
const CreateDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.createDoctorIntoDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Create Doctor Successfully',
        statusCode: http_status_1.default.CREATED,
        data: result
    });
}));
const CreatePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.createPatientIntoDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Create Patient Successfully',
        statusCode: http_status_1.default.CREATED,
        data: result
    });
}));
const getAllUserData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, user_constant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, user_constant_1.paginationFields);
    const result = yield user_service_1.userServices.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Users data fetched!",
        meta: result.meta,
        data: result.data
    });
}));
const updateUserStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.userServices.changeProfileStatus(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Users profile status changed!",
        data: result
    });
}));
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.userServices.getmyProfileIntoDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My profile Fetched!",
        data: result
    });
}));
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.userServices.updateMyProfile(user, req);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "My Profile update successfully",
        statusCode: http_status_1.default.OK,
        data: result
    });
}));
exports.userController = {
    CreateAdmin,
    CreateDoctor,
    CreatePatient,
    getAllUserData,
    updateUserStatus,
    getMyProfile,
    updateMyProfile
};
