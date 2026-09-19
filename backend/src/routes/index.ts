import { Router } from 'express';
import authRoutes from './auth.routes';
import doctorRoutes from './doctor.routes';
import appointmentRoutes from './appointment.routes';
import triageRoutes from './triage.routes';
import clinicalRoutes from './clinical.routes';
import adminRoutes from './admin.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/doctors', doctorRoutes);
apiRouter.use('/appointments', appointmentRoutes);
apiRouter.use('/triage', triageRoutes);
apiRouter.use('/clinical', clinicalRoutes);
apiRouter.use('/admin', adminRoutes);

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'PulsePoint Core API',
    timestamp: new Date().toISOString()
  });
});

export default apiRouter;
