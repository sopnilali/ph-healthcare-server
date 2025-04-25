
import express, { NextFunction, Request, Response } from 'express'
import { DoctorController } from './doctor.controller'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'
import { FileUploader } from '../../../helpers/fileUploader'
import { DoctorValidation } from './doctor.validation'
import validateRequest from '../../middlewares/validateRequest'

const router = express.Router()

router.get('/', DoctorController.GetAllDoctors)
router.get('/:id', DoctorController.getDoctorById)
router.patch('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR), validateRequest(DoctorValidation.updateDoctorValidation), DoctorController.updateDoctor)
router.delete('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR), DoctorController.deleteDoctor)
router.delete('/:id/soft', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR), DoctorController.SoftdeleteDoctor)

export const DoctorRoutes = router