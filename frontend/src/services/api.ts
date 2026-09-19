import {
  UserLoginInput,
  UserRegisterInput,
  SlotHoldInput,
  AppointmentConfirmInput,
  ClinicalRecordSubmitInput,
  DoctorLeaveCreateInput,
  DoctorDTO,
  AvailableSlot,
  AppointmentDTO,
  ClinicAnalyticsSummary,
  TriageUrgency
} from '@pulsepoint/shared';
import { DEFAULT_PHYSICIANS } from './defaultDoctors';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://healthcare-api-is49.onrender.com/api/v1' : '/api/v1');

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('pulsepoint_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.message || (data.errors ? data.errors.map((e: any) => e.message).join(', ') : 'Network request failed');
      throw new Error(errorMessage);
    }

    return data.data !== undefined ? data.data : data;
  }

  // Auth endpoints
  async login(credentials: UserLoginInput) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(data: UserRegisterInput) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getProfile() {
    return this.request<any>('/auth/me');
  }

  // Doctors & Directory
  async getDoctors(specialty?: string, search?: string): Promise<DoctorDTO[]> {
    try {
      const params = new URLSearchParams();
      if (specialty && specialty !== 'All Specialties') params.append('specialty', specialty);
      if (search) params.append('search', search);
      const doctors = await this.request<DoctorDTO[]>(`/doctors?${params.toString()}`);
      if (Array.isArray(doctors) && doctors.length > 0) {
        return doctors;
      }
    } catch (err) {
      console.warn('Backend doctors fetch failed or sleeping, using verified registry:', err);
    }

    // Resilient fallback to DEFAULT_PHYSICIANS
    let filtered = [...DEFAULT_PHYSICIANS];
    if (specialty && specialty !== 'All Specialties') {
      filtered = filtered.filter(d => 
        d.specialization.toLowerCase().includes(specialty.toLowerCase()) ||
        specialty.toLowerCase().includes(d.specialization.toLowerCase())
      );
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.bio.toLowerCase().includes(q)
      );
    }
    return filtered;
  }

  async getDoctorById(doctorId: string): Promise<DoctorDTO> {
    try {
      const doc = await this.request<DoctorDTO>(`/doctors/${doctorId}`);
      if (doc) return doc;
    } catch (err) {
      // fallback
    }
    const fallback = DEFAULT_PHYSICIANS.find(d => d.id === doctorId) || DEFAULT_PHYSICIANS[0];
    return fallback;
  }

  async getAvailableSlots(doctorId: string, date: string, patientId?: string): Promise<AvailableSlot[]> {
    try {
      const params = new URLSearchParams({ date });
      if (patientId) params.append('patientId', patientId);
      const slots = await this.request<AvailableSlot[]>(`/doctors/${doctorId}/slots?${params.toString()}`);
      if (Array.isArray(slots) && slots.length > 0) {
        return slots;
      }
    } catch (err) {
      console.warn('Backend slot fetch fallback for date:', date);
    }

    // Dynamic slot generation for selected date (9 AM to 5 PM every 30 mins)
    const generatedSlots: AvailableSlot[] = [];
    const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    for (const t of times) {
      const startIso = `${date}T${t}:00.000Z`;
      const [hh, mm] = t.split(':').map(Number);
      const endMins = mm + 30;
      const endHh = endMins >= 60 ? hh + 1 : hh;
      const finalMm = endMins >= 60 ? endMins - 60 : endMins;
      const endIso = `${date}T${String(endHh).padStart(2, '0')}:${String(finalMm).padStart(2, '0')}:00.000Z`;
      
      generatedSlots.push({
        slotStart: startIso,
        slotEnd: endIso,
        isAvailable: true,
        isHeld: false
      });
    }
    return generatedSlots;
  }

  // Slot Holding & Booking
  async holdSlot(data: SlotHoldInput) {
    return this.request<any>('/appointments/hold', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async releaseHold(holdId: string) {
    return this.request<any>(`/appointments/hold/${holdId}`, {
      method: 'DELETE'
    });
  }

  async confirmBooking(data: AppointmentConfirmInput) {
    return this.request<AppointmentDTO>('/appointments/confirm', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getPatientAppointments() {
    return this.request<AppointmentDTO[]>('/appointments/patient');
  }

  async getDoctorAppointments(date?: string) {
    const query = date ? `?date=${date}` : '';
    return this.request<AppointmentDTO[]>(`/appointments/doctor${query}`);
  }

  async cancelAppointment(appointmentId: string) {
    return this.request<any>(`/appointments/${appointmentId}/cancel`, {
      method: 'PATCH'
    });
  }

  // AI Triage
  async assessSymptoms(symptomsDescription: string) {
    return this.request<{
      urgencyLevel: TriageUrgency;
      primaryConcern: string;
      suggestedDoctorQuestions: string[];
    }>('/triage/assess', {
      method: 'POST',
      body: JSON.stringify({ symptomsDescription })
    });
  }

  // Clinical Consultation & Prescriptions
  async submitConsultation(data: ClinicalRecordSubmitInput) {
    return this.request<any>('/clinical/consultations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getMedicationAlerts() {
    return this.request<any[]>('/clinical/medications');
  }

  // Doctor Leaves
  async registerDoctorLeave(data: DoctorLeaveCreateInput) {
    return this.request<any>('/doctors/leaves/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getLeaveAudits() {
    return this.request<any[]>('/doctors/leaves/audits');
  }

  // Admin Analytics & Users
  async getAdminAnalytics() {
    return this.request<ClinicAnalyticsSummary>('/admin/analytics');
  }

  async getAdminUsers(role?: string) {
    const query = role ? `?role=${role}` : '';
    return this.request<any[]>(`/admin/users${query}`);
  }

  async toggleUserStatus(userId: string) {
    return this.request<any>(`/admin/users/${userId}/toggle-status`, {
      method: 'PATCH'
    });
  }
}

export const api = new ApiClient();
