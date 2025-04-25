"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialitiesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const specialties_controller_1 = require("./specialties.controller");
const fileUploader_1 = require("../../../helpers/fileUploader");
const specialties_validation_1 = require("./specialties.validation");
const router = express_1.default.Router();
router.post('/', fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = specialties_validation_1.SpecialitiesValidation.createSpecialitiesValidation.parse(JSON.parse(req.body.data));
    return specialties_controller_1.SpecialitiesController.createSpecialities(req, res, next);
});
router.get('/', specialties_controller_1.SpecialitiesController.getAllSpecialities);
router.delete('/:id', specialties_controller_1.SpecialitiesController.deteteSpecialities);
exports.SpecialitiesRoutes = router;
