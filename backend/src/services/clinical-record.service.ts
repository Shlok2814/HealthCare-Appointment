import { prisma } from '../config/database';
import { ClinicalRecordSubmitInput, AppointmentStatus } from '@pulsepoint/shared';
import { ClinicalAIService } from './clinical-ai.service';

export class ClinicalRecordService {
  static async submitConsultation(doctorId: string, input: ClinicalRecordSubmitInput) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: input.appointmentId }
    });

    if (!appointment) {
      const error: any = new Error('Appointment not found');
      error.statusCode = 404;
      throw error;
    }

    if (appointment.doctorId !== doctorId) {
      const error: any = new Error('Unauthorized: You are not the assigned physician for this appointment.');
      error.statusCode = 403;
      throw error;
    }

    // Generate AI Patient-Friendly Summary and Structured Medication Schedule
    const patientSummaryResult = ClinicalAIService.generatePatientSummary(
      input.diagnosis,
      input.clinicalNotes,
      input.prescriptions
    );

    return await prisma.$transaction(async (tx) => {
      // 1. Create or update Clinical Record
      const record = await tx.clinicalRecord.upsert({
        where: { appointmentId: input.appointmentId },
        create: {
          appointmentId: input.appointmentId,
          diagnosis: input.diagnosis,
          clinicalNotes: input.clinicalNotes,
          prescriptionsJson: input.prescriptions as any
        },
        update: {
          diagnosis: input.diagnosis,
          clinicalNotes: input.clinicalNotes,
          prescriptionsJson: input.prescriptions as any
        }
      });

      // 2. Create or update Patient Summary
      const summary = await tx.patientSummary.upsert({
        where: { appointmentId: input.appointmentId },
        create: {
          appointmentId: input.appointmentId,
          careInstructions: patientSummaryResult.careInstructions,
          medicationScheduleJson: patientSummaryResult.medicationSchedule as any,
          followUpRecommendationsJson: patientSummaryResult.followUpRecommendations as any
        },
        update: {
          careInstructions: patientSummaryResult.careInstructions,
          medicationScheduleJson: patientSummaryResult.medicationSchedule as any,
          followUpRecommendationsJson: patientSummaryResult.followUpRecommendations as any
        }
      });

      // 3. Mark appointment status as COMPLETED
      const updatedAppointment = await tx.appointment.update({
        where: { id: input.appointmentId },
        data: { status: AppointmentStatus.COMPLETED },
        include: {
          patient: { select: { id: true, name: true, email: true } },
          doctor: { include: { user: { select: { name: true } } } },
          clinicalRecord: true,
          patientSummary: true
        }
      });

      // 4. Generate Medication Reminders for each prescription
      if (input.prescriptions && input.prescriptions.length > 0) {
        const now = new Date();
        const alertsData = input.prescriptions.map((rx, idx) => ({
          appointmentId: input.appointmentId,
          patientId: appointment.patientId,
          medicationName: `${rx.medicationName} (${rx.dosage}) - ${rx.frequency}`,
          scheduledTime: new Date(now.getTime() + (idx + 1) * 4 * 60 * 60 * 1000) // Scheduled in 4-hour intervals
        }));

        await tx.medicationAlert.createMany({
          data: alertsData
        });
      }

      return {
        appointment: updatedAppointment,
        record,
        summary
      };
    });
  }

  static async getPatientMedications(patientId: string) {
    return await prisma.medicationAlert.findMany({
      where: { patientId },
      include: {
        appointment: {
          include: {
            doctor: {
              include: { user: { select: { name: true } } }
            }
          }
        }
      },
      orderBy: { scheduledTime: 'asc' }
    });
  }
}
