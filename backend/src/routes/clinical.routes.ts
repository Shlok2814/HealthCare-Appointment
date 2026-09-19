import { Router, Request, Response, NextFunction } from 'express';
import { ClinicalRecordService } from '../services/clinical-record.service';
import { authenticateJWT, requireRoles } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { ClinicalRecordSubmitSchema, UserRole } from '@pulsepoint/shared';

const router = Router();

// Doctor submits consultation notes, diagnosis & prescriptions
router.post(
  '/consultations',
  authenticateJWT,
  requireRoles(UserRole.DOCTOR, UserRole.ADMIN),
  validateBody(ClinicalRecordSubmitSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctorId = req.user!.userId;
      const result = await ClinicalRecordService.submitConsultation(doctorId, req.body);
      res.status(200).json({
        success: true,
        message: 'Consultation completed and prescriptions recorded.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
);

// Patient views their medication schedule and alerts
router.get('/medications', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const meds = await ClinicalRecordService.getPatientMedications(req.user!.userId);
    res.status(200).json({
      success: true,
      data: meds
    });
  } catch (err) {
    next(err);
  }
});

export default router;
