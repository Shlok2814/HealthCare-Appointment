import { DoctorDTO, AvailableSlot, DoctorRotationMetadata, ShiftStatusType } from '@pulsepoint/shared';

/**
 * Backend Doctor Rotation & Continuous Duty Engine
 */

export interface ShiftDefinition {
  name: string;
  tier: 'Morning Rounds' | 'Afternoon Clinic' | 'Evening Telehealth' | 'Night Urgent Care';
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  label: string;
}

export const BACKEND_ROTATION_SHIFTS: ShiftDefinition[] = [
  {
    name: 'Shift A',
    tier: 'Morning Rounds',
    startHour: 8,
    startMinute: 0,
    endHour: 14,
    endMinute: 0,
    label: 'Morning Primary Rounds (08:00 - 14:00)'
  },
  {
    name: 'Shift B',
    tier: 'Afternoon Clinic',
    startHour: 14,
    startMinute: 0,
    endHour: 20,
    endMinute: 0,
    label: 'Afternoon & Evening Consultations (14:00 - 20:00)'
  },
  {
    name: 'Shift C',
    tier: 'Evening Telehealth',
    startHour: 20,
    startMinute: 0,
    endHour: 23,
    endMinute: 30,
    label: 'Evening Telehealth & Rapid Care (20:00 - 23:30)'
  },
  {
    name: 'Shift D',
    tier: 'Night Urgent Care',
    startHour: 0,
    startMinute: 0,
    endHour: 8,
    endMinute: 0,
    label: '24/7 Urgent On-Call Telehealth (00:00 - 08:00)'
  }
];

export function computeBackendDoctorRotation(
  doctor: any,
  allDoctors: any[],
  currentDate: Date = new Date()
): DoctorRotationMetadata {
  const currentHour = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
  const currentFloatTime = currentHour + currentMinutes / 60;

  const specialtyPeers = allDoctors.filter(d => 
    d.specialization.toLowerCase() === doctor.specialization.toLowerCase() ||
    doctor.specialization.toLowerCase().includes(d.specialization.toLowerCase()) ||
    d.specialization.toLowerCase().includes(doctor.specialization.toLowerCase())
  );

  const docIndex = specialtyPeers.findIndex(d => d.id === doctor.id);
  const peerCount = Math.max(specialtyPeers.length, 1);

  let primaryShift: ShiftDefinition;
  let handoverDoctor: any | undefined;

  if (peerCount > 1 && docIndex >= 0) {
    const shiftIndex = docIndex % BACKEND_ROTATION_SHIFTS.length;
    primaryShift = BACKEND_ROTATION_SHIFTS[shiftIndex];
    
    const nextPeerIndex = (docIndex + 1) % peerCount;
    handoverDoctor = specialtyPeers[nextPeerIndex];
  } else {
    if (currentFloatTime >= 8 && currentFloatTime < 14) {
      primaryShift = BACKEND_ROTATION_SHIFTS[0];
    } else if (currentFloatTime >= 14 && currentFloatTime < 20) {
      primaryShift = BACKEND_ROTATION_SHIFTS[1];
    } else if (currentFloatTime >= 20 && currentFloatTime < 23.5) {
      primaryShift = BACKEND_ROTATION_SHIFTS[2];
    } else {
      primaryShift = BACKEND_ROTATION_SHIFTS[3];
    }
  }

  const shiftStartFloat = primaryShift.startHour + primaryShift.startMinute / 60;
  const shiftEndFloat = primaryShift.endHour + primaryShift.endMinute / 60;

  let shiftStatus: ShiftStatusType = 'ACTIVE_ON_DUTY';
  let nextRenewalTime = 'Tomorrow at 08:30';

  if (currentFloatTime >= shiftStartFloat && currentFloatTime < shiftEndFloat) {
    shiftStatus = 'ACTIVE_ON_DUTY';
    nextRenewalTime = `Handover to roster partner at ${String(primaryShift.endHour).padStart(2, '0')}:${String(primaryShift.endMinute).padStart(2, '0')}`;
  } else if (currentFloatTime < shiftStartFloat) {
    shiftStatus = 'NEXT_IN_ROTATION';
    nextRenewalTime = `Active on duty at ${String(primaryShift.startHour).padStart(2, '0')}:${String(primaryShift.startMinute).padStart(2, '0')} today`;
  } else {
    shiftStatus = 'LOOP_RENEWED';
    nextRenewalTime = `Renewed for Next Cycle: Tomorrow at ${String(primaryShift.startHour).padStart(2, '0')}:${String(primaryShift.startMinute).padStart(2, '0')}`;
  }

  return {
    shiftStatus,
    activeShiftWindow: `${String(primaryShift.startHour).padStart(2, '0')}:${String(primaryShift.startMinute).padStart(2, '0')} - ${String(primaryShift.endHour).padStart(2, '0')}:${String(primaryShift.endMinute).padStart(2, '0')}`,
    shiftLabel: primaryShift.label,
    handoverDoctorId: handoverDoctor?.id,
    handoverDoctorName: handoverDoctor?.name,
    handoverTime: `${String(primaryShift.endHour).padStart(2, '0')}:${String(primaryShift.endMinute).padStart(2, '0')}`,
    nextRenewalTime,
    is24x7Covered: true
  };
}

export function generateBackendPerpetualSlots(
  doctor: any,
  targetDateStr: string,
  existingAppointments: any[] = [],
  activeHolds: any[] = [],
  currentPatientId?: string,
  now: Date = new Date()
): AvailableSlot[] {
  const generatedSlots: AvailableSlot[] = [];
  
  const [year, month, day] = targetDateStr.split('-').map(Number);
  const isToday = 
    now.getUTCFullYear() === year && 
    now.getUTCMonth() + 1 === month && 
    now.getUTCDate() === day;

  const currentFloatTime = now.getUTCHours() + now.getUTCMinutes() / 60;

  const timeTiers: { time: string; tier: 'Morning Rounds' | 'Afternoon Clinic' | 'Evening Telehealth' | 'Night Urgent Care' }[] = [
    { time: '08:30', tier: 'Morning Rounds' },
    { time: '09:00', tier: 'Morning Rounds' },
    { time: '09:30', tier: 'Morning Rounds' },
    { time: '10:00', tier: 'Morning Rounds' },
    { time: '10:30', tier: 'Morning Rounds' },
    { time: '11:00', tier: 'Morning Rounds' },
    { time: '11:30', tier: 'Morning Rounds' },
    { time: '12:00', tier: 'Morning Rounds' },
    { time: '13:30', tier: 'Afternoon Clinic' },
    { time: '14:00', tier: 'Afternoon Clinic' },
    { time: '14:30', tier: 'Afternoon Clinic' },
    { time: '15:00', tier: 'Afternoon Clinic' },
    { time: '15:30', tier: 'Afternoon Clinic' },
    { time: '16:00', tier: 'Afternoon Clinic' },
    { time: '16:30', tier: 'Afternoon Clinic' },
    { time: '17:00', tier: 'Afternoon Clinic' },
    { time: '17:30', tier: 'Evening Telehealth' },
    { time: '18:00', tier: 'Evening Telehealth' },
    { time: '18:30', tier: 'Evening Telehealth' },
    { time: '19:00', tier: 'Evening Telehealth' },
    { time: '19:30', tier: 'Evening Telehealth' },
    { time: '20:00', tier: 'Evening Telehealth' },
    { time: '20:30', tier: 'Evening Telehealth' },
    { time: '21:00', tier: 'Night Urgent Care' },
    { time: '21:30', tier: 'Night Urgent Care' },
    { time: '22:00', tier: 'Night Urgent Care' },
    { time: '22:30', tier: 'Night Urgent Care' }
  ];

  for (const { time, tier } of timeTiers) {
    const [hh, mm] = time.split(':').map(Number);
    const startIso = `${targetDateStr}T${time}:00.000Z`;
    
    const endMins = mm + (doctor.slotDurationMinutes || 30);
    const endHh = endMins >= 60 ? hh + Math.floor(endMins / 60) : hh;
    const finalMm = endMins % 60;
    const endIso = `${targetDateStr}T${String(endHh).padStart(2, '0')}:${String(finalMm).padStart(2, '0')}:00.000Z`;

    const slotFloatTime = hh + mm / 60;
    const isPastToday = isToday && slotFloatTime < currentFloatTime;

    const isBooked = existingAppointments.some(appt => {
      const apptStartIso = new Date(appt.slotStart).toISOString();
      return apptStartIso === startIso;
    });

    const holdMatch = activeHolds.find(hold => {
      const holdStartIso = new Date(hold.slotStart).toISOString();
      return holdStartIso === startIso;
    });

    const isHeld = !!holdMatch;
    const isAvailable = !isPastToday && !isBooked && !isHeld;

    generatedSlots.push({
      slotStart: startIso,
      slotEnd: endIso,
      isAvailable,
      isHeld,
      heldByCurrentUser: holdMatch ? holdMatch.patientId === currentPatientId : false,
      tier,
      isAutoRenewed: isPastToday
    });
  }

  return generatedSlots;
}
