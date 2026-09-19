import { Router, Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { authenticateJWT, requireRoles } from '../middlewares/auth.middleware';
import { UserRole } from '@pulsepoint/shared';

const router = Router();

// Clinic overview & KPIs
router.get(
  '/analytics',
  authenticateJWT,
  requireRoles(UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await AnalyticsService.getClinicOverview();
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (err) {
      next(err);
    }
  }
);

// Manage users (patients, doctors, admins)
router.get(
  '/users',
  authenticateJWT,
  requireRoles(UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = req.query.role as string | undefined;
      const users = await AnalyticsService.getAllUsers(role);
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (err) {
      next(err);
    }
  }
);

// Toggle user activation status
router.patch(
  '/users/:userId/toggle-status',
  authenticateJWT,
  requireRoles(UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await AnalyticsService.toggleUserStatus(req.params.userId);
      res.status(200).json({
        success: true,
        message: `User account is now ${updated.isActive ? 'Active' : 'Disabled'}.`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
