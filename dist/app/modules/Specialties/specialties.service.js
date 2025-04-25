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
exports.SpecialitiesService = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createSpecialitiesIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadImage = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.icon = uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.secure_url;
    }
    const result = yield prisma_1.default.specialties.create({
        data: req.body
    });
    return result;
});
const getAllSpecialitiesIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.specialties.findMany();
    if (!result) {
        throw new AppError_1.default(httpStatus.BAD_REQUEST, "Specialities Not Found");
    }
    return result;
});
const deteteSpecialitiesIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.specialties.findUniqueOrThrow({
        where: { id }
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedata = yield transactionClient.specialties.delete({
            where: { id }
        });
        return deletedata;
    }));
    return result;
});
exports.SpecialitiesService = {
    createSpecialitiesIntoDB,
    getAllSpecialitiesIntoDB,
    deteteSpecialitiesIntoDB
};
