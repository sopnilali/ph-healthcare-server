"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const doctorSchedulte_controller_1 = require("./doctorSchedulte.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get('/', doctorSchedulte_controller_1.DoctorScheduleController.getAllFromDB);
router.get('/my-schedule', (0, auth_1.default)(client_1.UserRole.DOCTOR), doctorSchedulte_controller_1.DoctorScheduleController.GetMySchedule);
router.post('/', (0, auth_1.default)(client_1.UserRole.DOCTOR), doctorSchedulte_controller_1.DoctorScheduleController.InsertSchedule);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.DOCTOR), doctorSchedulte_controller_1.DoctorScheduleController.deleteFromDB);
exports.DoctorScheduleRoutes = router;
