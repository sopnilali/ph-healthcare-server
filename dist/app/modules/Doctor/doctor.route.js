"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const doctor_controller_1 = require("./doctor.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const doctor_validation_1 = require("./doctor.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router.get('/', doctor_controller_1.DoctorController.GetAllDoctors);
router.get('/:id', doctor_controller_1.DoctorController.getDoctorById);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.DOCTOR), (0, validateRequest_1.default)(doctor_validation_1.DoctorValidation.updateDoctorValidation), doctor_controller_1.DoctorController.updateDoctor);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.DOCTOR), doctor_controller_1.DoctorController.deleteDoctor);
router.delete('/:id/soft', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.DOCTOR), doctor_controller_1.DoctorController.SoftdeleteDoctor);
exports.DoctorRoutes = router;
