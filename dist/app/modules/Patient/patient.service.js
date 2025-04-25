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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const patient_constant_1 = require("./patient.constant");
const GetAllPatientIntoDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (filters.searchTerm) {
        andCondition.push({
            OR: patient_constant_1.patientSearchAbleFields.map(filed => ({
                [filed]: {
                    contains: filters.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    const whereConditons = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.patient.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    });
    const total = yield prisma_1.default.patient.count({
        where: whereConditons
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const getPatientByIdIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.patient.findUniqueOrThrow({
        where: { id }
    });
    const result = yield prisma_1.default.patient.findUnique({
        where: { id },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    });
    return result;
});
const updatePatientIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientHealthData, medicalReport } = payload, patientData = __rest(payload, ["patientHealthData", "medicalReport"]);
    const patientInfo = yield prisma_1.default.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        //update patient data
        yield transactionClient.patient.update({
            where: {
                id
            },
            data: patientData,
            include: {
                patientHealthData: true,
                medicalReport: true
            }
        });
        // create or update patient health data
        if (patientHealthData) {
            yield transactionClient.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id
                },
                update: patientHealthData,
                create: Object.assign(Object.assign({}, patientHealthData), { patientId: patientInfo.id })
            });
        }
        ;
        if (medicalReport) {
            yield transactionClient.medicalReport.create({
                data: Object.assign(Object.assign({}, medicalReport), { patientId: patientInfo.id })
            });
        }
    }));
    const responseData = yield prisma_1.default.patient.findUnique({
        where: {
            id: patientInfo.id
        },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    });
    return responseData;
});
const deletePatientIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patientInfo = yield prisma_1.default.patient.findUniqueOrThrow({
        where: { id }
    });
    const result = yield prisma_1.default.$transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
        //delete medical report
        yield trx.medicalReport.deleteMany({
            where: {
                patientId: patientInfo.id
            }
        });
        //delete patient health data
        yield trx.patientHealthData.delete({
            where: { patientId: patientInfo.id }
        });
        //delete patient data
        yield trx.patient.delete({
            where: { id }
        });
        yield trx.user.delete({
            where: { email: patientInfo.email }
        });
    }));
    return result;
});
const softdeletePatientIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patientInfo = yield prisma_1.default.patient.findUniqueOrThrow({
        where: { id }
    });
    const result = yield prisma_1.default.$transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
        //delete patient data
        yield trx.patient.update({
            where: { id },
            data: {
                isDeleted: true
            }
        });
        yield trx.user.update({
            where: { email: patientInfo.email },
            data: {
                status: client_1.UserStatus.DELETED
            }
        });
    }));
    return result;
});
exports.PatientServices = {
    GetAllPatientIntoDB,
    getPatientByIdIntoDB,
    updatePatientIntoDB,
    deletePatientIntoDB,
    softdeletePatientIntoDB
};
