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
exports.DoctorServices = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const doctor_constant_1 = require("./doctor.constant");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const GetAllDoctorIntoDB = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, specialties } = filter, filterData = __rest(filter, ["searchTerm", "specialties"]);
    console.log(specialties);
    const andCondition = [];
    if (filter.searchTerm) {
        andCondition.push({
            OR: doctor_constant_1.doctorSearchAbleFields.map(field => ({
                [field]: {
                    contains: filter.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    ;
    // doctor > doctorSpecialities
    if (specialties && specialties.length > 0) {
        andCondition.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: "insensitive"
                        }
                    }
                }
            }
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
    andCondition.push({ isDeleted: false });
    const whereConditons = { AND: andCondition };
    const result = yield prisma_1.default.doctor.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });
    const total = yield prisma_1.default.doctor.count({
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
const getDoctorByIdIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.doctor.findUniqueOrThrow({
        where: { id }
    });
    const result = yield prisma_1.default.doctor.findUnique({
        where: { id }
    });
    return result;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { specialties } = payload, doctorData = __rest(payload, ["specialties"]);
    const doctorInfo = yield prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.doctor.update({
            where: {
                id
            },
            data: doctorData
        });
        if (specialties && specialties.length > 0) {
            // delete specialties
            const deleteSpecialtiesIds = specialties.filter(specialty => specialty.isDeleted);
            //console.log(deleteSpecialtiesIds)
            for (const specialty of deleteSpecialtiesIds) {
                yield transactionClient.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialty.specialtiesId
                    }
                });
            }
            // create specialties
            const createSpecialtiesIds = specialties.filter(specialty => !specialty.isDeleted);
            console.log(createSpecialtiesIds);
            for (const specialty of createSpecialtiesIds) {
                yield transactionClient.doctorSpecialties.create({
                    data: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialty.specialtiesId
                    }
                });
            }
        }
    }));
    const result = yield prisma_1.default.doctor.findUnique({
        where: {
            id: doctorInfo.id
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });
    return result;
});
const deleteDoctorIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.doctor.findFirstOrThrow({
        where: { id }
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const verifyDoctor = yield transactionClient.doctor.delete({
            where: { id }
        });
        yield transactionClient.user.delete({
            where: { email: verifyDoctor.email }
        });
        return verifyDoctor;
    }));
    return result;
});
const softDeleteDoctorIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.doctor.findFirstOrThrow({
        where: { id }
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const deleteVerify = yield transactionClient.doctor.update({
            where: { id },
            data: {
                isDeleted: true
            }
        });
        yield transactionClient.user.update({
            where: { email: deleteVerify.email },
            data: {
                status: client_1.UserStatus.DELETED
            }
        });
        console.log(deleteVerify);
    }));
    return result;
});
exports.DoctorServices = {
    GetAllDoctorIntoDB,
    getDoctorByIdIntoDB,
    updateIntoDB,
    deleteDoctorIntoDB,
    softDeleteDoctorIntoDB
};
