import express, { NextFunction, Request, Response } from 'express'
import { userController } from './user.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';

import { FileUploader } from '../../../helpers/fileUploader';
import { UserValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();


router.get('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), userController.getAllUserData)
router.get('/me', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT), userController.getMyProfile)


router.post('/create-admin', FileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction)=> {
  req.body = UserValidation.createAdminValidation.parse(JSON.parse(req.body.data))
  return userController.CreateAdmin(req, res, next)
})

router.post('/create-doctor', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), FileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction)=> {
  req.body = UserValidation.createDoctorValidation.parse(JSON.parse(req.body.data))
  return userController.CreateDoctor(req, res, next)
})

router.post('/create-patient', FileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction)=> {
  req.body = UserValidation.createPatientValidation.parse(JSON.parse(req.body.data))
  return userController.CreatePatient(req, res, next)
})

router.patch('/:id/status', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), validateRequest(UserValidation.updateStatusValidation), userController.updateUserStatus)

router.patch('/update-my-profile', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT), FileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction)=> {
  req.body = UserValidation.updateAdminValidation.parse(JSON.parse(req.body.data))
  return userController.updateMyProfile(req, res, next)
})


export const UserRoutes = router;