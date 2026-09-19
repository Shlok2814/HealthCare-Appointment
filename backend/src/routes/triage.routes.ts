import { Router, Request, Response, NextFunction } from 'express';
import { ClinicalAIService } from '../services/clinical-ai.service';
import { validateBody } from '../middlewares/validate.middleware';
import { SymptomTriageSchema } from '@pulsepoint/shared';

const router = Router();

// Run instant pre-assessment on patient symptoms
router.post('/assess', validateBody(SymptomTriageSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analysis = await ClinicalAIService.triageSymptoms(req.body.symptomsDescription);
    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
});

export default router;
