import React, { useState } from 'react';
import { AppointmentDTO, AppointmentStatus, TriageUrgency } from '@pulsepoint/shared';
import { 
  Calendar, Clock, User, FileText, Pill, AlertTriangle, 
  ShieldCheck, XCircle, ChevronDown, ChevronUp, Video, Printer 
} from 'lucide-react';

interface AppointmentCardProps {
  appointment: AppointmentDTO;
  onCancel?: (appointmentId: string) => void;
  isDoctorView?: boolean;
  onOpenConsultation?: (appointment: AppointmentDTO) => void;
  onOpenTelehealth?: (appointment: AppointmentDTO) => void;
  onPrintPrescription?: (appointment: AppointmentDTO) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  isDoctorView = false,
  onOpenConsultation,
  onOpenTelehealth,
  onPrintPrescription
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return <span className="pulse-badge pulse-badge-success">Confirmed</span>;
      case AppointmentStatus.COMPLETED:
        return <span className="pulse-badge pulse-badge-info">Completed</span>;
      case AppointmentStatus.CANCELLED:
        return <span className="pulse-badge pulse-badge-danger">Cancelled</span>;
      case AppointmentStatus.HELD:
        return <span className="pulse-badge pulse-badge-warning">Held</span>;
      default:
        return <span className="pulse-badge pulse-badge-neutral">{status}</span>;
    }
  };

  const getUrgencyBadge = (urgency?: TriageUrgency) => {
    if (!urgency) return null;
    switch (urgency) {
      case TriageUrgency.EMERGENCY:
        return <span className="pulse-badge pulse-badge-danger" style={{ fontSize: '0.7rem' }}>Emergency</span>;
      case TriageUrgency.URGENT:
        return <span className="pulse-badge pulse-badge-warning" style={{ fontSize: '0.7rem' }}>Urgent</span>;
      case TriageUrgency.MODERATE:
        return <span className="pulse-badge pulse-badge-info" style={{ fontSize: '0.7rem' }}>Moderate</span>;
      default:
        return <span className="pulse-badge pulse-badge-success" style={{ fontSize: '0.7rem' }}>Routine</span>;
    }
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  const start = formatDateTime(appointment.slotStart);

  return (
    <div className="pulse-card" style={{ padding: '20px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            background: 'var(--primary-50)',
            border: '1.5px solid var(--primary-200)',
            borderRadius: '12px',
            padding: '12px 16px',
            textAlign: 'center',
            minWidth: '90px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-700)', textTransform: 'uppercase' }}>
              {new Date(appointment.slotStart).toLocaleDateString([], { month: 'short' })}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {new Date(appointment.slotStart).getDate()}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {start.time}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {isDoctorView ? appointment.patient?.name : (appointment.doctor as any)?.name || (appointment.doctor as any)?.user?.name || 'Assigned Specialist'}
              </h4>
              {getStatusBadge(appointment.status)}
              {appointment.triageAssessment && getUrgencyBadge(appointment.triageAssessment.urgencyLevel)}
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isDoctorView ? `Patient Contact: ${appointment.patient?.email}` : `${appointment.doctor?.specialization || 'Specialist'}`}
            </p>
          </div>
        </div>

        {/* Card Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Join Telehealth Virtual Room */}
          {appointment.status === AppointmentStatus.CONFIRMED && onOpenTelehealth && (
            <button
              onClick={() => onOpenTelehealth(appointment)}
              className="pulse-btn"
              style={{ 
                background: '#0D9488', 
                color: '#FFFFFF', 
                fontSize: '0.825rem', 
                padding: '6px 14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
              }}
            >
              <Video size={14} /> Join Video Call
            </button>
          )}

          {/* Doctor Write Consultation Notes */}
          {isDoctorView && appointment.status === AppointmentStatus.CONFIRMED && onOpenConsultation && (
            <button
              onClick={() => onOpenConsultation(appointment)}
              className="pulse-btn pulse-btn-primary"
              style={{ fontSize: '0.825rem', padding: '6px 14px' }}
            >
              <FileText size={14} /> Clinical Notes
            </button>
          )}

          {/* Print Official Prescription & Summary */}
          {appointment.status === AppointmentStatus.COMPLETED && appointment.clinicalRecord && onPrintPrescription && (
            <button
              onClick={() => onPrintPrescription(appointment)}
              className="pulse-btn pulse-btn-secondary"
              style={{ fontSize: '0.825rem', padding: '6px 14px', fontWeight: 600 }}
            >
              <Printer size={14} /> Print Rx Summary
            </button>
          )}

          {appointment.status === AppointmentStatus.CONFIRMED && onCancel && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="pulse-btn pulse-btn-danger"
              style={{ fontSize: '0.825rem', padding: '6px 12px' }}
            >
              <XCircle size={14} /> Cancel
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="pulse-btn pulse-btn-secondary"
            style={{ padding: '6px 10px' }}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expandable Details Accordion */}
      {isExpanded && (
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Symptoms description */}
          {appointment.symptomIntake && (
            <div style={{ background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Reported Chief Complaint:
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                {appointment.symptomIntake.symptomsDescription}
              </p>
            </div>
          )}

          {/* AI Clinical Triage Probing Questions */}
          {appointment.triageAssessment && (
            <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)', padding: '12px 16px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-800)', textTransform: 'uppercase', marginBottom: '6px' }}>
                <ShieldCheck size={14} /> AI Triage Assessment ({appointment.triageAssessment.urgencyLevel})
              </div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-900)', marginBottom: '8px' }}>
                {appointment.triageAssessment.primaryConcern}
              </p>
              {appointment.triageAssessment.suggestedDoctorQuestions && (
                <ul style={{ margin: '4px 0 0 16px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                  {(appointment.triageAssessment.suggestedDoctorQuestions as string[]).map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Clinical Record & Post-Visit Summary */}
          {appointment.clinicalRecord && (
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E0E7FF', padding: '14px 18px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-700)', textTransform: 'uppercase', marginBottom: '8px' }}>
                <FileText size={16} /> Clinical Diagnosis & Prescription
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Diagnosis: {appointment.clinicalRecord.diagnosis}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {appointment.clinicalRecord.clinicalNotes}
              </p>

              {(appointment.clinicalRecord.prescriptions || (appointment.clinicalRecord as any).prescriptionsJson) && (
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Prescribed Medications:
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginTop: '6px' }}>
                    {(appointment.clinicalRecord.prescriptions || (appointment.clinicalRecord as any).prescriptionsJson || []).map((rx: any, idx: number) => (
                      <div key={idx} style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '8px', fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Pill size={14} /> {rx.medicationName || rx.medicine} ({rx.dosage})
                        </div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{rx.frequency} • {rx.durationDays} days</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
