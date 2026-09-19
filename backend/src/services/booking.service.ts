import { prisma } from '../config/database';
import { AppointmentConfirmInput, AppointmentStatus, TriageUrgency } from '@pulsepoint/shared';
import { ClinicalAIService } from './clinical-ai.service';

export class BookingService {
  static async confirmBooking(patientId: string, input: AppointmentConfirmInput) {
    const slotStart = new Date(input.slotStart);
    const slotEnd = new Date(input.slotEnd);
    const now = new Date();

    if (slotStart <= now) {
      const error: any = new Error('Cannot book an appointment in the past.');
      error.statusCode = 400;
      throw error;
    }

    // Run clinical AI triage on the submitted symptoms
    const triage = await ClinicalAIService.triageSymptoms(input.symptomsDescription);

    return await prisma.$transaction(async (tx) => {
      // 1. Check if doctor is on leave
      const leave = await tx.doctorLeave.findFirst({
        where: {
          doctorId: input.doctorId,
          date: {
            gte: new Date(new Date(slotStart).setUTCHours(0, 0, 0, 0)),
            lte: new Date(new Date(slotStart).setUTCHours(23, 59, 59, 999))
          }
        }
      });

      if (leave) {
        const error: any = new Error('Doctor is not accepting appointments on this date due to scheduled leave.');
        error.statusCode = 400;
        throw error;
      }

      // 2. Concurrency check: Ensure slot is not already confirmed
      const existing = await tx.appointment.findFirst({
        where: {
          doctorId: input.doctorId,
          slotStart,
          status: { in: [AppointmentStatus.CONFIRMED] }
        }
      });

      if (existing) {
        const error: any = new Error('This timeslot was just booked by another patient. Please choose another slot.');
        error.statusCode = 409;
        throw error;
      }

      // 3. Create confirmed appointment
      const appointment = await tx.appointment.create({
        data: {
          patientId,
          doctorId: input.doctorId,
          slotStart,
          slotEnd,
          status: AppointmentStatus.CONFIRMED,
          symptomIntake: {
            create: {
              symptomsDescription: input.symptomsDescription
            }
          },
          triageAssessment: {
            create: {
              urgencyLevel: triage.urgencyLevel as any,
              primaryConcern: triage.primaryConcern,
              suggestedDoctorQuestions: triage.suggestedDoctorQuestions,
              rawAIOutput: triage.rawAIOutput,
              status: triage.status as any
            }
          }
        },
        include: {
          doctor: {
            include: {
              user: {
                select: { name: true, email: true, phone: true }
              }
            }
          },
          patient: {
            select: { id: true, name: true, email: true, phone: true }
          },
          symptomIntake: true,
          triageAssessment: true
        }
      });

      // 4. Clear slot hold
      await tx.slotHold.deleteMany({
        where: {
          doctorId: input.doctorId,
          slotStart
        }
      });

      return appointment;
    });
  }

  static async getPatientAppointments(patientId: string) {
    return await prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          include: {
            user: {
              select: { name: true, email: true, phone: true }
            }
          }
        },
        symptomIntake: true,
        triageAssessment: true,
        clinicalRecord: true,
        patientSummary: true
      },
      orderBy: { slotStart: 'desc' }
    });
  }

  static async getDoctorAppointments(doctorId: string, dateStr?: string) {
    const where: any = { doctorId };

    if (dateStr) {
      const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
      const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);
      where.slotStart = { gte: dayStart, lte: dayEnd };
    }

    return await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: { id: true, name: true, email: true, phone: true }
        },
        symptomIntake: true,
        triageAssessment: true,
        clinicalRecord: true,
        patientSummary: true
      },
      orderBy: { slotStart: 'asc' }
    });
  }

  static async cancelAppointment(appointmentId: string, requestedByUserId: string, userRole: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      const error: any = new Error('Appointment not found');
      error.statusCode = 404;
      throw error;
    }

    // Role check: Patient can cancel their own, Doctor can cancel their own, Admin can cancel any
    if (userRole === 'PATIENT' && appointment.patientId !== requestedByUserId) {
      const error: any = new Error('Unauthorized to cancel this appointment');
      error.statusCode = 403;
      throw error;
    }

    if (userRole === 'DOCTOR' && appointment.doctorId !== requestedByUserId) {
      const error: any = new Error('Unauthorized to cancel this appointment');
      error.statusCode = 403;
      throw error;
    }

    return await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
      include: {
        patient: { select: { name: true, email: true } },
        doctor: { include: { user: { select: { name: true } } } }
      }
    });
  }
}
