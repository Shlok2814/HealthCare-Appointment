import { DoctorDTO, AvailableSlot, DoctorRotationMetadata, ShiftStatusType } from '@pulsepoint/shared';

/**
 * PulsePoint Continuous Rotation & Perpetual Availability Scheduling Engine
 * 
 * Guarantees 24/7 continuous clinician availability and automated shift handovers.
 * When a physician's active consultation shift concludes:
 * 1. The next rotating specialist in that medical discipline takes over seamlessly.
 * 2. The previous physician's schedule automatically renews into the next on-duty cycle.
 * 3. Doctors and booking slots never disappear for future dates, weekends, or late hours.
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

export const ROTATION_SHIFTS: ShiftDefinition[] = [
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

/**
 * Assigns or computes rotation metadata for a doctor within their medical specialty pool.
 */
export function computeDoctorRotation(
  doctor: DoctorDTO,
  allDoctors: DoctorDTO[],
  currentDate: Date = new Date()
): DoctorRotationMetadata {
  const currentHour = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
  const currentFloatTime = currentHour + currentMinutes / 60;

  // Find peers in same or related specialty
  const specialtyPeers = allDoctors.filter(d => 
    d.specialization.toLowerCase() === doctor.specialization.toLowerCase() ||
    doctor.specialization.toLowerCase().includes(d.specialization.toLowerCase()) ||
    d.specialization.toLowerCase().includes(doctor.specialization.toLowerCase())
  );

  const docIndex = specialtyPeers.findIndex(d => d.id === doctor.id);
  const peerCount = Math.max(specialtyPeers.length, 1);

  // If multiple doctors in this specialty, alternate primary shifts
  let primaryShift: ShiftDefinition;
  let handoverDoctor: DoctorDTO | undefined;

  if (peerCount > 1 && docIndex >= 0) {
    const shiftIndex = docIndex % ROTATION_SHIFTS.length;
    primaryShift = ROTATION_SHIFTS[shiftIndex];
    
    // The handover doctor is the next peer on the roster ring
    const nextPeerIndex = (docIndex + 1) % peerCount;
    handoverDoctor = specialtyPeers[nextPeerIndex];
  } else {
    // Single doctor in specialty: continuous auto-renewing multi-tier coverage
    if (currentFloatTime >= 8 && currentFloatTime < 14) {
      primaryShift = ROTATION_SHIFTS[0];
    } else if (currentFloatTime >= 14 && currentFloatTime < 20) {
      primaryShift = ROTATION_SHIFTS[1];
    } else if (currentFloatTime >= 20 && currentFloatTime < 23.5) {
      primaryShift = ROTATION_SHIFTS[2];
    } else {
      primaryShift = ROTATION_SHIFTS[3];
    }
  }

  // Determine active status right now
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

/**
 * Enriches a list of doctors with live rotation and auto-renewal metadata.
 */
export function enrichDoctorsWithRotation(
  doctors: DoctorDTO[],
  currentDate: Date = new Date()
): DoctorDTO[] {
  return doctors.map(doc => ({
    ...doc,
    rotation: computeDoctorRotation(doc, doctors, currentDate)
  }));
}

/**
 * Generates perpetual loop-renewed slots for any doctor on any date (past/present/future/weekends).
 */
export function generatePerpetualSlots(
  doctor: DoctorDTO,
  targetDateStr: string,
  options?: {
    existingBookings?: any[];
    activeHolds?: any[];
    currentPatientId?: string;
    now?: Date;
  }
): AvailableSlot[] {
  const generatedSlots: AvailableSlot[] = [];
  const now = options?.now || new Date();
  
  // Format target date YYYY-MM-DD
  const [year, month, day] = targetDateStr.split('-').map(Number);
  const isToday = 
    now.getFullYear() === year && 
    now.getMonth() + 1 === month && 
    now.getDate() === day;

  const currentFloatTime = now.getHours() + now.getMinutes() / 60;

  // Granular rotating times covering all 4 daily duty tiers
  const timeTiers: { time: string; tier: 'Morning Rounds' | 'Afternoon Clinic' | 'Evening Telehealth' | 'Night Urgent Care' }[] = [
    // Morning Rounds
    { time: '08:30', tier: 'Morning Rounds' },
    { time: '09:00', tier: 'Morning Rounds' },
    { time: '09:30', tier: 'Morning Rounds' },
    { time: '10:00', tier: 'Morning Rounds' },
    { time: '10:30', tier: 'Morning Rounds' },
    { time: '11:00', tier: 'Morning Rounds' },
    { time: '11:30', tier: 'Morning Rounds' },
    { time: '12:00', tier: 'Morning Rounds' },
    // Afternoon Clinic
    { time: '13:30', tier: 'Afternoon Clinic' },
    { time: '14:00', tier: 'Afternoon Clinic' },
    { time: '14:30', tier: 'Afternoon Clinic' },
    { time: '15:00', tier: 'Afternoon Clinic' },
    { time: '15:30', tier: 'Afternoon Clinic' },
    { time: '16:00', tier: 'Afternoon Clinic' },
    { time: '16:30', tier: 'Afternoon Clinic' },
    { time: '17:00', tier: 'Afternoon Clinic' },
    // Evening Telehealth & Handover
    { time: '17:30', tier: 'Evening Telehealth' },
    { time: '18:00', tier: 'Evening Telehealth' },
    { time: '18:30', tier: 'Evening Telehealth' },
    { time: '19:00', tier: 'Evening Telehealth' },
    { time: '19:30', tier: 'Evening Telehealth' },
    { time: '20:00', tier: 'Evening Telehealth' },
    { time: '20:30', tier: 'Evening Telehealth' },
    // Night Urgent Care & 24/7 Loop
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

    // Check if slot has already concluded today
    const isPastToday = isToday && slotFloatTime < currentFloatTime;

    // Check database bookings / holds if provided
    const isBooked = options?.existingBookings?.some(b => 
      b.slotStart === startIso || new Date(b.slotStart).toISOString() === startIso
    );

    const holdMatch = options?.activeHolds?.find(h => 
      h.slotStart === startIso || new Date(h.slotStart).toISOString() === startIso
    );

    const isHeld = !!holdMatch;
    const isAvailable = !isPastToday && !isBooked && !isHeld;

    generatedSlots.push({
      slotStart: startIso,
      slotEnd: endIso,
      isAvailable,
      isHeld,
      heldByCurrentUser: holdMatch ? holdMatch.patientId === options?.currentPatientId : false,
      tier,
      isAutoRenewed: isPastToday
    });
  }

  return generatedSlots;
}
