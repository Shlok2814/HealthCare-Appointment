import { Router, Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service';
import { SlotHoldService } from '../services/slot-hold.service';
import { authenticateJWT, requireRoles } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { SlotHoldSchema, AppointmentConfirmSchema, UserRole } from '@pulsepoint/shared';

const router = Router();

// Hold a slot during checkout/intake
router.post(
  '/hold',
  authenticateJWT,
  validateBody(SlotHoldSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { doctorId, slotStart, slotEnd } = req.body;
      const hold = await SlotHoldService.holdSlot(doctorId, req.user!.userId, slotStart, slotEnd);
      res.status(200).json({
        success: true,
        message: 'Slot temporarily locked for 5 minutes.',
        data: hold
      });
    } catch (err) {
      next(err);
    }
  }
);

// Release a slot hold
router.delete(
  '/hold/:holdId',
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await SlotHoldService.releaseHold(req.params.holdId, req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Slot hold released.'
      });
    } catch (err) {
      next(err);
    }
  }
);

// Confirm booking with symptom intake & AI triage
router.post(
  '/confirm',
  authenticateJWT,
  validateBody(AppointmentConfirmSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const appointment = await BookingService.confirmBooking(req.user!.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Appointment confirmed successfully!',
        data: appointment
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get current patient's appointments
router.get('/patient', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointments = await BookingService.getPatientAppointments(req.user!.userId);
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (err) {
    next(err);
  }
});

// Get doctor's scheduled appointments
router.get(
  '/doctor',
  authenticateJWT,
  requireRoles(UserRole.DOCTOR, UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctorId = req.user?.role === UserRole.DOCTOR ? req.user.userId : (req.query.doctorId as string || req.user!.userId);
      const date = req.query.date as string | undefined;
      const appointments = await BookingService.getDoctorAppointments(doctorId, date);
      res.status(200).json({
        success: true,
        data: appointments
      });
    } catch (err) {
      next(err);
    }
  }
);

// Cancel an appointment
router.patch('/:id/cancel', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cancelled = await BookingService.cancelAppointment(
      req.params.id,
      req.user!.userId,
      req.user!.role
    );
    res.status(200).json({
      success: true,
      message: 'Appointment cancelled.',
      data: cancelled
    });
  } catch (err) {
    next(err);
  }
});

export default router;
