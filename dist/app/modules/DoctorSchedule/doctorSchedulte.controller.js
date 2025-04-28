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
exports.DoctorScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const doctorSchedulte_service_1 = require("./doctorSchedulte.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const doctorSchedule_constant_1 = require("./doctorSchedule.constant");
const InsertSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield doctorSchedulte_service_1.DoctorScheduleServices.InsertIntoDB(user, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Doctor Schadule create Successfully!",
        data: result
    });
}));
const GetMySchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, doctorSchedule_constant_1.doctorScheduleSearchAbleFields);
    const Options = (0, pick_1.default)(req.query, doctorSchedule_constant_1.paginationFields);
    const user = req.user;
    const result = yield doctorSchedulte_service_1.DoctorScheduleServices.getMySchedule(filter, Options, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Schadules fetch Successfully!",
        data: result
    });
}));
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, doctorSchedule_constant_1.doctorScheduleSearchAbleFields);
    const Options = (0, pick_1.default)(req.query, doctorSchedule_constant_1.paginationFields);
    const result = yield doctorSchedulte_service_1.DoctorScheduleServices.getAllFromDB(filter, Options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Schadules fetch Successfully!",
        data: result
    });
}));
const deleteFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const result = yield doctorSchedulte_service_1.DoctorScheduleServices.deleteFromDB(user, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My Schedule deleted successfully!",
        data: result
    });
}));
exports.DoctorScheduleController = {
    InsertSchedule,
    GetMySchedule,
    getAllFromDB,
    deleteFromDB
};
