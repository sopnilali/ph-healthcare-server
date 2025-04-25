"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), user_controller_1.userController.getAllUserData);
router.get('/me', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT), user_controller_1.userController.getMyProfile);
router.post('/create-admin', fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createAdminValidation.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.CreateAdmin(req, res, next);
});
router.post('/create-doctor', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createDoctorValidation.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.CreateDoctor(req, res, next);
});
router.post('/create-patient', fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createPatientValidation.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.CreatePatient(req, res, next);
});
router.patch('/:id/status', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateStatusValidation), user_controller_1.userController.updateUserStatus);
router.patch('/update-my-profile', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT), fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.updateAdminValidation.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.updateMyProfile(req, res, next);
});
exports.UserRoutes = router;
