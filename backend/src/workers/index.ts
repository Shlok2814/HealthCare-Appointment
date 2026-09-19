import cron from 'node-cron';
import { SlotHoldService } from '../services/slot-hold.service';
import { prisma } from '../config/database';

export const startBackgroundJobs = () => {
  // 1. Cleanup expired slot holds every 1 minute
  cron.schedule('* * * * *', async () => {
    try {
      const result = await SlotHoldService.cleanupExpiredHolds();
      if (result.count > 0) {
        console.log(`[Worker] Expired slot holds cleaned up: ${result.count}`);
      }
    } catch (err) {
      console.error('[Worker Error] Slot hold cleanup failed:', err);
    }
  });

  // 2. Dispatch pending medication alerts every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const pendingAlerts = await prisma.medicationAlert.findMany({
        where: {
          isSent: false,
          scheduledTime: { lte: new Date() }
        },
        include: {
          patient: true
        },
        take: 50
      });

      for (const alert of pendingAlerts) {
        // Mark as sent & log reminder simulation
        await prisma.medicationAlert.update({
          where: { id: alert.id },
          data: {
            isSent: true,
            sentAt: new Date()
          }
        });
        console.log(`[Worker] Medication Alert sent to ${alert.patient.email}: ${alert.medicationName}`);
      }
    } catch (err) {
      console.error('[Worker Error] Medication alert worker failed:', err);
    }
  });

  console.log('[PulsePoint] Background cron workers successfully initialized.');
};
