import express from 'express'
import { AdminController } from './admin.controller'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'

const router = express.Router()

router.get('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), AdminController.getAllFromDB )
router.get('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), AdminController.getAdminById)
router.patch('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminController.updateAdmin)
router.delete('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminController.deleteAdmin)
router.delete('/soft/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminController.softDeleteAdmin)

export const AdminRoutes = router