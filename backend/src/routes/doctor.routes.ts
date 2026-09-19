import { Router, Request, Response, NextFunction } from 'express';
import { DoctorService } from '../services/doctor.service';
import { authenticateJWT, requireRoles } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { DoctorLeaveCreateSchema, UserRole } from '@pulsepoint/shared';

const router = Router();

// Public: Browse doctors directory
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const specialty = req.query.specialty as string | undefined;
    const search = req.query.search as string | undefined;
    const doctors = await DoctorService.getAllDoctors({ specialty, search });
    res.status(200).json({
      success: true,
      data: doctors
    });
  } catch (err) {
    next(err);
  }
});

// Public: Get doctor details
router.get('/:doctorId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctor = await DoctorService.getDoctorById(req.params.doctorId);
    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (err) {
    next(err);
  }
});

// Get real-time available slots for a specific date
router.get('/:doctorId/slots', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "date" (YYYY-MM-DD) is required.'
      });
    }

    const patientId = req.query.patientId as string | undefined;
    const slots = await DoctorService.getAvailableSlots(req.params.doctorId, date, patientId);
    
    res.status(200).json({
      success: true,
      data: slots
    });
  } catch (err) {
    next(err);
  }
});

// Doctor only: Register leave and auto-cancel conflicting appointments
router.post(
  '/leaves/register',
  authenticateJWT,
  requireRoles(UserRole.DOCTOR, UserRole.ADMIN),
  validateBody(DoctorLeaveCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctorId = req.user?.role === UserRole.DOCTOR ? req.user.userId : (req.body.doctorId || req.user!.userId);
      const result = await DoctorService.registerLeave(doctorId, req.body.date, req.body.reason);
      
      res.status(201).json({
        success: true,
        message: `Leave registered successfully. ${result.cancelledCount} conflicting appointment(s) were automatically cancelled and resolved.`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
);

// View leave conflict logs
router.get(
  '/leaves/audits',
  authenticateJWT,
  requireRoles(UserRole.DOCTOR, UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctorId = req.user?.role === UserRole.DOCTOR ? req.user.userId : undefined;
      const audits = await DoctorService.getLeaveAudits(doctorId);
      res.status(200).json({
        success: true,
        data: audits
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
