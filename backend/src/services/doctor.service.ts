import { prisma } from '../config/database';
import { WorkingShift, AvailableSlot, AppointmentStatus } from '@pulsepoint/shared';
import { computeBackendDoctorRotation, generateBackendPerpetualSlots } from './rotationEngine';

export class DoctorService {
  static async getAllDoctors(query?: { specialty?: string; search?: string }) {
    const where: any = {
      user: { isActive: true }
    };

    if (query?.specialty) {
      where.specialization = {
        equals: query.specialty,
        mode: 'insensitive'
      };
    }

    if (query?.search) {
      where.OR = [
        { user: { name: { contains: query.search, mode: 'insensitive' } } },
        { specialization: { contains: query.search, mode: 'insensitive' } },
        { bio: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const doctors = await prisma.doctorProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    const mappedDoctors = doctors.map(doc => ({
      id: doc.userId,
      name: doc.user.name,
      email: doc.user.email,
      phone: doc.user.phone,
      specialization: doc.specialization,
      bio: doc.bio,
      consultationFee: doc.consultationFee,
      slotDurationMinutes: doc.slotDurationMinutes,
      experienceYears: doc.experienceYears,
      rating: doc.rating,
      workingHours: doc.workingHours as unknown as WorkingShift[]
    }));

    return mappedDoctors.map(doc => ({
      ...doc,
      rotation: computeBackendDoctorRotation(doc, mappedDoctors)
    }));
  }

  static async getDoctorById(doctorId: string) {
    const doc = await prisma.doctorProfile.findUnique({
      where: { userId: doctorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        leaves: {
          orderBy: { date: 'asc' }
        }
      }
    });

    if (!doc) {
      const error: any = new Error('Doctor not found.');
      error.statusCode = 404;
      throw error;
    }

    const docDto = {
      id: doc.userId,
      name: doc.user.name,
      email: doc.user.email,
      phone: doc.user.phone,
      specialization: doc.specialization,
      bio: doc.bio,
      consultationFee: doc.consultationFee,
      slotDurationMinutes: doc.slotDurationMinutes,
      experienceYears: doc.experienceYears,
      rating: doc.rating,
      workingHours: doc.workingHours as unknown as WorkingShift[],
      leaves: doc.leaves.map(l => ({
        id: l.id,
        date: l.date.toISOString().split('T')[0],
        reason: l.reason
      }))
    };

    return {
      ...docDto,
      rotation: computeBackendDoctorRotation(docDto, [docDto])
    };
  }

  static async getAvailableSlots(doctorId: string, targetDateStr: string, currentPatientId?: string): Promise<AvailableSlot[]> {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId: doctorId }
    });

    if (!doctor) {
      const error: any = new Error('Doctor profile not found');
      error.statusCode = 404;
      throw error;
    }

    const dayStart = new Date(`${targetDateStr}T00:00:00.000Z`);
    const dayEnd = new Date(`${targetDateStr}T23:59:59.999Z`);

    // Fetch existing confirmed bookings and active holds
    const now = new Date();
    const [existingAppointments, activeHolds] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          doctorId,
          slotStart: { gte: dayStart, lte: dayEnd },
          status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.HELD] }
        }
      }),
      prisma.slotHold.findMany({
        where: {
          doctorId,
          slotStart: { gte: dayStart, lte: dayEnd },
          expiresAt: { gt: now }
        }
      })
    ]);

    // Use perpetual loop scheduling engine so slots never run out on any day or after hours
    return generateBackendPerpetualSlots(
      doctor,
      targetDateStr,
      existingAppointments,
      activeHolds,
      currentPatientId,
      now
    );
  }

  static async registerLeave(doctorId: string, dateStr: string, reason?: string) {
    const leaveDate = new Date(`${dateStr}T00:00:00.000Z`);
    const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

    // Register leave in transaction, sweep conflicting appointments, and log resolution
    return await prisma.$transaction(async (tx) => {
      // 1. Create or ensure leave record
      const existingLeave = await tx.doctorLeave.findFirst({
        where: {
          doctorId,
          date: { gte: dayStart, lte: dayEnd }
        }
      });

      let leave = existingLeave;
      if (!existingLeave) {
        leave = await tx.doctorLeave.create({
          data: {
            doctorId,
            date: leaveDate,
            reason: reason || 'Scheduled Doctor Leave'
          }
        });
      }

      // 2. Find all conflicting confirmed/held appointments on this day
      const conflictingAppointments = await tx.appointment.findMany({
        where: {
          doctorId,
          slotStart: { gte: dayStart, lte: dayEnd },
          status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.HELD] }
        },
        include: {
          patient: true
        }
      });

      // 3. Auto-cancel conflicting appointments
      if (conflictingAppointments.length > 0) {
        await tx.appointment.updateMany({
          where: {
            id: { in: conflictingAppointments.map(a => a.id) }
          },
          data: {
            status: AppointmentStatus.CANCELLED
          }
        });

        // 4. Log Leave Resolution Audit
        await tx.leaveResolutionAudit.create({
          data: {
            doctorId,
            leaveDate,
            cancelledAppointmentsCount: conflictingAppointments.length,
            affectedAppointmentsJson: conflictingAppointments.map(a => ({
              appointmentId: a.id,
              patientId: a.patientId,
              patientName: a.patient.name,
              patientEmail: a.patient.email,
              slotStart: a.slotStart.toISOString(),
              reason: 'Doctor scheduled sudden leave'
            }))
          }
        });

        // 5. Release any active holds for that day
        await tx.slotHold.deleteMany({
          where: {
            doctorId,
            slotStart: { gte: dayStart, lte: dayEnd }
          }
        });
      }

      return {
        leave,
        cancelledCount: conflictingAppointments.length,
        affectedPatients: conflictingAppointments.map(a => ({
          name: a.patient.name,
          email: a.patient.email,
          slotStart: a.slotStart
        }))
      };
    });
  }

  static async getLeaveAudits(doctorId?: string) {
    return await prisma.leaveResolutionAudit.findMany({
      where: doctorId ? { doctorId } : {},
      include: {
        doctor: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      },
      orderBy: { loggedAt: 'desc' }
    });
  }
}
