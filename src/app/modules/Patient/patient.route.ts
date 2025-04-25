import express from 'express'
import { patientController } from './patient.controller'

const router = express.Router()

router.get('/', patientController.GetAllPatient)
router.get('/:id', patientController.getPatientById)
router.patch('/:id', patientController.updatePatient)
router.delete('/:id', patientController.deletePatient)
router.delete('/:id/soft', patientController.softdeletePatient)

export const PatientRoutes = router