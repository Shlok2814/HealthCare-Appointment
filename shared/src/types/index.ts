export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export enum AppointmentStatus {
  HELD = 'HELD',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW'
}

export enum TriageUrgency {
  ROUTINE = 'ROUTINE',
  MODERATE = 'MODERATE',
  URGENT = 'URGENT',
  EMERGENCY = 'EMERGENCY'
}

export enum AIAnalysisStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  FALLBACK = 'FALLBACK'
}

export enum NotificationType {
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  CANCELLATION_NOTICE = 'CANCELLATION_NOTICE',
  DOCTOR_LEAVE_ALERT = 'DOCTOR_LEAVE_ALERT',
  MEDICATION_ALERT = 'MEDICATION_ALERT'
}

export interface WorkingShift {
  weekday: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

export interface PrescriptionItem {
  medicationName: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  instructions?: string;
}

export interface MedicationScheduleEntry {
  medicine: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  instructions?: string;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface DoctorDTO {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  specialization: string;
  bio: string;
  experienceYears?: number;
  consultationFee: number;
  slotDurationMinutes: number;
  workingHours: WorkingShift[];
  avatarUrl?: string;
  rating?: number;
  totalConsultations?: number;
}

export interface AvailableSlot {
  slotStart: string;
  slotEnd: string;
  isAvailable: boolean;
  isHeld: boolean;
  heldByCurrentUser?: boolean;
}

export interface AppointmentDTO {
  id: string;
  patientId: string;
  doctorId: string;
  slotStart: string;
  slotEnd: string;
  status: AppointmentStatus;
  createdAt: string;
  patient?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  doctor?: {
    id: string;
    name: string;
    email: string;
    specialization: string;
    consultationFee: number;
  };
  symptomIntake?: {
    symptomsDescription: string;
    submittedAt: string;
  };
  triageAssessment?: {
    urgencyLevel: TriageUrgency;
    primaryConcern: string;
    suggestedDoctorQuestions: string[];
    analyzedAt: string;
  };
  clinicalRecord?: {
    diagnosis: string;
    clinicalNotes: string;
    prescriptions: PrescriptionItem[];
    createdAt: string;
  };
  patientSummary?: {
    careInstructions: string;
    medicationSchedule: MedicationScheduleEntry[];
    followUpRecommendations: string[];
  };
}

export interface ClinicAnalyticsSummary {
  totalAppointments: number;
  completedAppointments: number;
  activePatients: number;
  totalDoctors: number;
  totalRevenue: number;
  cancellationRate: number;
  departmentDistribution: {
    specialty: string;
    count: number;
  }[];
  monthlyTrends: {
    month: string;
    appointments: number;
    revenue: number;
  }[];
}
