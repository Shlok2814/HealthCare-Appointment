import { prisma } from '../config/database';
import { config } from '../config';
import { AppointmentStatus } from '@pulsepoint/shared';

export class SlotHoldService {
  static async holdSlot(doctorId: string, patientId: string, slotStartStr: string, slotEndStr: string) {
    const slotStart = new Date(slotStartStr);
    const slotEnd = new Date(slotEndStr);
    const now = new Date();

    if (slotStart <= now) {
      const error: any = new Error('Cannot hold a timeslot in the past.');
      error.statusCode = 400;
      throw error;
    }

    const expiresAt = new Date(now.getTime() + config.slotHoldMinutes * 60 * 1000);

    return await prisma.$transaction(async (tx) => {
      // 1. Clean up expired holds across the system
      await tx.slotHold.deleteMany({
        where: { expiresAt: { lte: now } }
      });

      // 2. Check if already booked
      const existingBooking = await tx.appointment.findFirst({
        where: {
          doctorId,
          slotStart,
          status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.HELD] }
        }
      });

      if (existingBooking) {
        const error: any = new Error('This timeslot has already been reserved or booked.');
        error.statusCode = 409;
        throw error;
      }

      // 3. Check if currently held by someone else
      const activeHold = await tx.slotHold.findFirst({
        where: {
          doctorId,
          slotStart,
          expiresAt: { gt: now }
        }
      });

      if (activeHold) {
        if (activeHold.patientId === patientId) {
          // Refresh user's own hold expiration
          return await tx.slotHold.update({
            where: { id: activeHold.id },
            data: { expiresAt }
          });
        } else {
          const error: any = new Error('This slot is currently held by another patient. Please try another slot or check back shortly.');
          error.statusCode = 409;
          throw error;
        }
      }

      // 4. Remove any prior holds by this patient for the same doctor to avoid stale locks
      await tx.slotHold.deleteMany({
        where: {
          patientId,
          doctorId
        }
      });

      // 5. Create new hold lock
      return await tx.slotHold.create({
        data: {
          doctorId,
          patientId,
          slotStart,
          slotEnd,
          expiresAt
        }
      });
    });
  }

  static async releaseHold(holdId: string, patientId: string) {
    return await prisma.slotHold.deleteMany({
      where: {
        id: holdId,
        patientId
      }
    });
  }

  static async cleanupExpiredHolds() {
    return await prisma.slotHold.deleteMany({
      where: {
        expiresAt: { lte: new Date() }
      }
    });
  }
}
