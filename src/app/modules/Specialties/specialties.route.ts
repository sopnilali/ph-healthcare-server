

import express, { NextFunction, Request, Response } from 'express'
import { SpecialitiesController } from './specialties.controller'
import { FileUploader } from '../../../helpers/fileUploader'
import { SpecialitiesValidation } from './specialties.validation'

const router = express.Router()

router.post('/', FileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction)=> {
    req.body = SpecialitiesValidation.createSpecialitiesValidation.parse(JSON.parse(req.body.data))
    return SpecialitiesController.createSpecialities(req, res, next)
})

router.get('/', SpecialitiesController.getAllSpecialities)
router.delete('/:id', SpecialitiesController.deteteSpecialities)

export const SpecialitiesRoutes = router