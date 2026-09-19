import { prisma } from '../config/database';
import { AppointmentStatus, ClinicAnalyticsSummary } from '@pulsepoint/shared';

export class AnalyticsService {
  static async getClinicOverview(): Promise<ClinicAnalyticsSummary> {
    const [
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      activePatients,
      totalDoctors,
      doctorsWithProfiles,
      allAppointments
    ] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: AppointmentStatus.COMPLETED } }),
      prisma.appointment.count({ where: { status: AppointmentStatus.CANCELLED } }),
      prisma.user.count({ where: { role: 'PATIENT', isActive: true } }),
      prisma.user.count({ where: { role: 'DOCTOR', isActive: true } }),
      prisma.doctorProfile.findMany({
        select: {
          specialization: true,
          consultationFee: true,
          doctorBookings: {
            select: { id: true, status: true }
          }
        }
      }),
      prisma.appointment.findMany({
        select: {
          slotStart: true,
          status: true,
          doctor: {
            select: { consultationFee: true }
          }
        }
      })
    ]);

    // Calculate total revenue from completed appointments
    let totalRevenue = 0;
    for (const appt of allAppointments) {
      if (appt.status === AppointmentStatus.COMPLETED) {
        totalRevenue += appt.doctor.consultationFee;
      }
    }

    const cancellationRate = totalAppointments > 0 
      ? parseFloat(((cancelledAppointments / totalAppointments) * 100).toFixed(1)) 
      : 0;

    // Department / Specialty distribution
    const specialtyMap = new Map<string, number>();
    for (const doc of doctorsWithProfiles) {
      const current = specialtyMap.get(doc.specialization) || 0;
      specialtyMap.set(doc.specialization, current + doc.doctorBookings.length);
    }

    const departmentDistribution = Array.from(specialtyMap.entries()).map(([specialty, count]) => ({
      specialty,
      count
    }));

    // Monthly trends (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = new Map<string, { appointments: number; revenue: number }>();

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap.set(key, { appointments: 0, revenue: 0 });
    }

    for (const appt of allAppointments) {
      const d = new Date(appt.slotStart);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (monthlyMap.has(key)) {
        const entry = monthlyMap.get(key)!;
        entry.appointments += 1;
        if (appt.status === AppointmentStatus.COMPLETED) {
          entry.revenue += appt.doctor.consultationFee;
        }
      }
    }

    const monthlyTrends = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      appointments: data.appointments,
      revenue: data.revenue
    }));

    return {
      totalAppointments,
      completedAppointments,
      activePatients,
      totalDoctors,
      totalRevenue,
      cancellationRate,
      departmentDistribution,
      monthlyTrends
    };
  }

  static async getAllUsers(role?: string) {
    const where: any = {};
    if (role) {
      where.role = role;
    }

    return await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        doctorProfile: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async toggleUserStatus(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive }
    });
  }
}
