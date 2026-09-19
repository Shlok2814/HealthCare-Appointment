import React, { useState } from 'react';
import { api } from '../../services/api';
import { AvailableSlot, DoctorDTO, TriageUrgency } from '@pulsepoint/shared';
import { Sparkles, AlertTriangle, CheckCircle, ShieldAlert, X, Activity } from 'lucide-react';

interface SymptomTriageModalProps {
  doctor: DoctorDTO;
  slot: AvailableSlot;
  onClose: () => void;
  onConfirmSuccess: (appointment: any) => void;
}

export const SymptomTriageModal: React.FC<SymptomTriageModalProps> = ({
  doctor,
  slot,
  onClose,
  onConfirmSuccess
}) => {
  const [symptoms, setSymptoms] = useState('');
  const [isAssessing, setIsAssessing] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssessSymptoms = async () => {
    if (symptoms.trim().length < 10) {
      setError('Please provide at least 10 characters describing your symptoms.');
      return;
    }

    setIsAssessing(true);
    setError(null);
    try {
      const result = await api.assessSymptoms(symptoms);
      setTriageResult(result);
    } catch (err: any) {
      setError(err.message || 'AI Triage service temporarily unavailable');
    } finally {
      setIsAssessing(false);
    }
  };

  const handleFinalConfirm = async () => {
    if (symptoms.trim().length < 5) {
      setError('Symptom description is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const appt = await api.confirmBooking({
        doctorId: doctor.id,
        slotStart: slot.slotStart,
        slotEnd: slot.slotEnd,
        symptomsDescription: symptoms
      });
      onConfirmSuccess(appt);
    } catch (err: any) {
      setError(err.message || 'Failed to confirm booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyBadge = (urgency: TriageUrgency) => {
    switch (urgency) {
      case TriageUrgency.EMERGENCY:
        return <span className="pulse-badge pulse-badge-danger"><ShieldAlert size={14} /> High Emergency</span>;
      case TriageUrgency.URGENT:
        return <span className="pulse-badge pulse-badge-warning"><AlertTriangle size={14} /> Urgent Priority</span>;
      case TriageUrgency.MODERATE:
        return <span className="pulse-badge pulse-badge-info"><Activity size={14} /> Moderate Care</span>;
      default:
        return <span className="pulse-badge pulse-badge-success"><CheckCircle size={14} /> Routine Visit</span>;
    }
  };

  const formatSlotTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <span className="pulse-badge pulse-badge-info" style={{ marginBottom: '6px' }}>Step 2 of 2</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Clinical Intake & AI Triage
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Doctor & Slot summary pill */}
        <div style={{ background: 'var(--bg-subtle)', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{doctor.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{doctor.specialization} • Fee: ₹{doctor.consultationFee}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-700)' }}>
              {formatSlotTime(slot.slotStart)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>30-min Consultation</div>
          </div>
        </div>

        {/* Symptoms Form */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            Describe your current symptoms & chief complaint:
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            placeholder="e.g., Severe migraine with light sensitivity for 3 days, accompanied by nausea..."
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: '1.5px solid var(--border-strong)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-family)',
              outline: 'none',
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Used by our Clinical Engine to prepare diagnostic questions for your physician.
            </span>
            <button
              type="button"
              onClick={handleAssessSymptoms}
              disabled={isAssessing || symptoms.trim().length < 10}
              className="pulse-btn pulse-btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <Sparkles size={14} color="var(--accent-600)" />
              {isAssessing ? 'Analyzing...' : 'Preview AI Triage'}
            </button>
          </div>
        </div>

        {/* Triage Preview Result Card */}
        {triageResult && (
          <div style={{
            background: 'linear-gradient(135deg, #F0FDFA 0%, #EEF2FF 100%)',
            border: '1.5px solid var(--primary-200)',
            borderRadius: '14px',
            padding: '18px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--primary-600)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  PulsePoint Clinical AI Assessment
                </span>
              </div>
              {getUrgencyBadge(triageResult.urgencyLevel)}
            </div>

            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-900)', marginBottom: '8px' }}>
              {triageResult.primaryConcern}
            </div>

            {triageResult.suggestedDoctorQuestions && triageResult.suggestedDoctorQuestions.length > 0 && (
              <div style={{ marginTop: '12px', borderTop: '1px dashed var(--primary-200)', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Probing Questions Prepared for {doctor.name}:
                </span>
                <ul style={{ margin: '6px 0 0 18px', fontSize: '0.825rem', color: 'var(--text-main)' }}>
                  {triageResult.suggestedDoctorQuestions.map((q: string, i: number) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ padding: '12px', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
          <button onClick={onClose} className="pulse-btn pulse-btn-secondary" disabled={isSubmitting}>
            Cancel
          </button>
          <button
            onClick={handleFinalConfirm}
            className="pulse-btn pulse-btn-primary"
            disabled={isSubmitting || symptoms.trim().length < 5}
          >
            <CheckCircle size={16} />
            {isSubmitting ? 'Confirming Reservation...' : 'Confirm & Book Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};
