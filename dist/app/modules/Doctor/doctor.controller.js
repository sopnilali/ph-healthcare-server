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
exports.DoctorController = void 0;
const pick_1 = __importDefault(require("../../../shared/pick"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const doctor_constant_1 = require("./doctor.constant");
const doctor_service_1 = require("./doctor.service");
const http_status_1 = __importDefault(require("http-status"));
const GetAllDoctors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, doctor_constant_1.doctorFilterableFields);
    const Options = (0, pick_1.default)(req.query, doctor_constant_1.paginationFields);
    const result = yield doctor_service_1.DoctorServices.GetAllDoctorIntoDB(filter, Options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Doctors Retrived Successfully!",
        data: result
    });
}));
const getDoctorById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield doctor_service_1.DoctorServices.getDoctorByIdIntoDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Doctor Retrived Successfully!",
        data: result
    });
}));
const updateDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield doctor_service_1.DoctorServices.updateIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Doctor Retrived Successfully!",
        data: result
    });
}));
const deleteDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield doctor_service_1.DoctorServices.deleteDoctorIntoDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Doctor Delete Successfully!"
    });
}));
const SoftdeleteDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield doctor_service_1.DoctorServices.softDeleteDoctorIntoDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Doctor Delete Successfully!"
    });
}));
exports.DoctorController = {
    GetAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    SoftdeleteDoctor
};
