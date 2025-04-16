import express from 'express'
import { userController } from './user.controller';

const router = express.Router();

router.post('/', userController.CreateAdmin)

export const UserRoutes = router;