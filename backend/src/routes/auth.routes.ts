import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { validateBody } from '../middlewares/validate.middleware';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { UserRegisterSchema, UserLoginSchema } from '@pulsepoint/shared';

const router = Router();

router.post('/register', validateBody(UserRegisterSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', validateBody(UserLoginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await AuthService.getProfile(req.user!.userId);
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
});

export default router;
