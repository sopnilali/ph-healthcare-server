import express from 'express'
import { ScheduleController } from './schedule.controller'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'

const router = express.Router()

router.post('/', ScheduleController.InsertSchedule)
router.get('/', auth(UserRole.DOCTOR), ScheduleController.GetAllData)
router.get('/:id', auth(UserRole.DOCTOR), ScheduleController.GetByIdData)
router.delete('/:id', auth(UserRole.DOCTOR), ScheduleController.DeleteScheduleData)


export const ScheduleRoutes = router