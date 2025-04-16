import express from 'express'
import { AdminController } from './admin.controller'

const router = express.Router()

router.get('/', AdminController.getAllFromDB )
// router.get('/:id')
// router.patch('/:id')
// router.delete('/:id')
// router.delete('/soft/:id')

export const AdminRoutes = router