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
exports.AdminServices = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const admin_constant_1 = require("./admin.constant");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const getAllUserIntoDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
    if (params.searchTerm) {
        andCondition.push({
            OR: admin_constant_1.adminSearchField.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    ;
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
    const result = yield prisma_1.default.admin.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });
    const total = yield prisma_1.default.admin.count({
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
const getByIdIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.admin.findUnique({
        where: { id, isDeleted: false }
    });
    return result;
});
const updateAdminIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyAdmin = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.admin.findFirstOrThrow({
            where: { id, isDeleted: false }
        });
        const updateadmin = yield transactionClient.admin.update({
            where: { id },
            data: payload
        });
        return updateadmin;
    }));
    return verifyAdmin;
});
const deleteAdminIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.admin.findFirstOrThrow({
        where: { id }
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const adminDeleteData = yield transactionClient.admin.delete({
            where: { id }
        });
        yield transactionClient.user.delete({
            where: {
                email: adminDeleteData.email
            }
        });
        return adminDeleteData;
    }));
    return result;
});
const softDeleteAdminIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.admin.findFirstOrThrow({
        where: { id }
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const adminDeleteData = yield transactionClient.admin.update({
            where: { id },
            data: {
                isDeleted: true
            }
        });
        yield transactionClient.user.update({
            where: {
                email: adminDeleteData.email
            },
            data: {
                status: client_1.UserStatus.DELETED
            }
        });
    }));
    return result;
});
exports.AdminServices = {
    getAllUserIntoDB,
    getByIdIntoDB,
    updateAdminIntoDB,
    deleteAdminIntoDB,
    softDeleteAdminIntoDB
};
