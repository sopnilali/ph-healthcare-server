import express from 'express'
import { DoctorScheduleController } from './doctorSchedulte.controller'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'

const router = express.Router()
router.get('/', DoctorScheduleController.getAllFromDB)
router.get('/my-schedule', auth(UserRole.DOCTOR), DoctorScheduleController.GetMySchedule)
router.post('/', auth(UserRole.DOCTOR), DoctorScheduleController.InsertSchedule)
router.delete('/:id', auth(UserRole.DOCTOR), DoctorScheduleController.deleteFromDB)

export const DoctorScheduleRoutes = router