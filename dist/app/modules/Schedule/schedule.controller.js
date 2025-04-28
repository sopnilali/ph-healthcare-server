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
exports.ScheduleController = void 0;
const pick_1 = __importDefault(require("../../../shared/pick"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const schedule_constant_1 = require("./schedule.constant");
const schedule_service_1 = require("./schedule.service");
const InsertSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield schedule_service_1.ScheduleService.InsertIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Schadue create Successfully!",
        data: result
    });
}));
const GetAllData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, schedule_constant_1.ScheduleSearchAbleFields);
    const Options = (0, pick_1.default)(req.query, schedule_constant_1.paginationFields);
    const user = req.user;
    const result = yield schedule_service_1.ScheduleService.getAllScheduleFromDB(filter, Options, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Schadules fetch Successfully!",
        data: result
    });
}));
const GetByIdData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield schedule_service_1.ScheduleService.getByIdIntoDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Schadule fetch Successfully!",
        data: result
    });
}));
const DeleteScheduleData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield schedule_service_1.ScheduleService.deleteScheduleIntoDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Schadule delete Successfully!"
    });
}));
exports.ScheduleController = {
    InsertSchedule,
    GetAllData,
    GetByIdData,
    DeleteScheduleData
};
