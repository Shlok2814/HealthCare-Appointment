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

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

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
  async getDoctors(specialty?: string, search?: string) {
    const params = new URLSearchParams();
    if (specialty) params.append('specialty', specialty);
    if (search) params.append('search', search);
    return this.request<DoctorDTO[]>(`/doctors?${params.toString()}`);
  }

  async getDoctorById(doctorId: string) {
    return this.request<DoctorDTO>(`/doctors/${doctorId}`);
  }

  async getAvailableSlots(doctorId: string, date: string, patientId?: string) {
    const params = new URLSearchParams({ date });
    if (patientId) params.append('patientId', patientId);
    return this.request<AvailableSlot[]>(`/doctors/${doctorId}/slots?${params.toString()}`);
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
