import { z } from 'zod';
import { UserRole, AppointmentStatus, TriageUrgency } from '../types/index.js';

export const UserRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).default(UserRole.PATIENT),
  phone: z.string().optional(),
  // Optional doctor registration fields
  specialization: z.string().optional(),
  bio: z.string().optional(),
  consultationFee: z.number().positive().optional()
});

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const SlotHoldSchema = z.object({
  doctorId: z.string().uuid('Invalid Doctor ID'),
  slotStart: z.string().datetime('Invalid slot start ISO date string'),
  slotEnd: z.string().datetime('Invalid slot end ISO date string')
});

export const SymptomTriageSchema = z.object({
  symptomsDescription: z.string().min(10, 'Please describe your symptoms in at least 10 characters'),
  durationDays: z.number().min(0).optional(),
  severity: z.enum(['MILD', 'MODERATE', 'SEVERE']).optional()
});

export const AppointmentConfirmSchema = z.object({
  holdId: z.string().uuid().optional(),
  doctorId: z.string().uuid('Invalid Doctor ID'),
  slotStart: z.string().datetime(),
  slotEnd: z.string().datetime(),
  symptomsDescription: z.string().min(5, 'Symptom description is required for clinical review')
});

export const PrescriptionItemSchema = z.object({
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required (e.g. 500mg)'),
  frequency: z.string().min(1, 'Frequency is required (e.g. Twice daily after meals)'),
  durationDays: z.number().int().positive('Duration days must be at least 1'),
  instructions: z.string().optional()
});

export const ClinicalRecordSubmitSchema = z.object({
  appointmentId: z.string().uuid('Invalid Appointment ID'),
  diagnosis: z.string().min(2, 'Diagnosis is required'),
  clinicalNotes: z.string().min(5, 'Clinical notes are required'),
  prescriptions: z.array(PrescriptionItemSchema).default([])
});

export const DoctorLeaveCreateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  reason: z.string().optional()
});

export type UserRegisterInput = z.infer<typeof UserRegisterSchema>;
export type UserLoginInput = z.infer<typeof UserLoginSchema>;
export type SlotHoldInput = z.infer<typeof SlotHoldSchema>;
export type SymptomTriageInput = z.infer<typeof SymptomTriageSchema>;
export type AppointmentConfirmInput = z.infer<typeof AppointmentConfirmSchema>;
export type PrescriptionItemInput = z.infer<typeof PrescriptionItemSchema>;
export type ClinicalRecordSubmitInput = z.infer<typeof ClinicalRecordSubmitSchema>;
export type DoctorLeaveCreateInput = z.infer<typeof DoctorLeaveCreateSchema>;
