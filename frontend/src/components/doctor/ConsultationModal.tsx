import React, { useState } from 'react';
import { api } from '../../services/api';
import { AppointmentDTO, PrescriptionItem } from '@pulsepoint/shared';
import { FileText, Pill, Plus, Trash2, CheckCircle, X, Sparkles, AlertCircle } from 'lucide-react';

interface ConsultationModalProps {
  appointment: AppointmentDTO;
  onClose: () => void;
  onConsultationComplete: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  appointment,
  onClose,
  onConsultationComplete
}) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { medicationName: '', dosage: '', frequency: 'Once daily after meals', durationDays: 7, instructions: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicationName: '', dosage: '', frequency: 'Twice daily after meals', durationDays: 5, instructions: '' }
    ]);
  };

  const handleRemovePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handlePrescriptionChange = (index: number, field: keyof PrescriptionItem, value: any) => {
    const updated = [...prescriptions];
    updated[index] = { ...updated[index], [field]: value };
    setPrescriptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim() || !clinicalNotes.trim()) {
      setError('Please provide diagnosis and clinical consultation notes.');
      return;
    }

    // Filter valid prescriptions
    const validPrescriptions = prescriptions.filter(p => p.medicationName.trim() && p.dosage.trim());

    setIsSubmitting(true);
    setError(null);
    try {
      await api.submitConsultation({
        appointmentId: appointment.id,
        diagnosis,
        clinicalNotes,
        prescriptions: validPrescriptions
      });
      onConsultationComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to complete consultation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '780px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <span className="pulse-badge pulse-badge-info" style={{ marginBottom: '6px' }}>Doctor Console</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Complete Clinical Consultation
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Patient & Symptom Overview */}
        <div style={{ background: 'var(--bg-subtle)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Patient: {appointment.patient?.name} ({appointment.patient?.email})
            </span>
            <span className="pulse-badge pulse-badge-warning">In Consultation</span>
          </div>
          {appointment.symptomIntake && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong>Chief Complaint:</strong> {appointment.symptomIntake.symptomsDescription}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Diagnosis */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Clinical Diagnosis:
            </label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g., Acute Bacterial Sinusitis / Exertional Hypertension"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-strong)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-family)'
              }}
            />
          </div>

          {/* Clinical Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Physician Findings & Evaluation Notes:
            </label>
            <textarea
              required
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Record clinical examination notes, vitals review, diagnostic recommendations..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-strong)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-family)',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Digital Prescriptions Builder */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Pill size={18} color="var(--primary-600)" />
                Digital Prescriptions (Rx)
              </label>
              <button
                type="button"
                onClick={handleAddPrescription}
                className="pulse-btn pulse-btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                <Plus size={14} /> Add Medicine
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {prescriptions.map((rx, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr auto', gap: '8px', alignItems: 'center', background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '10px' }}>
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Amoxicillin)"
                    value={rx.medicationName}
                    onChange={(e) => handlePrescriptionChange(index, 'medicationName', e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-strong)', fontSize: '0.825rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Dosage (500mg)"
                    value={rx.dosage}
                    onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-strong)', fontSize: '0.825rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Frequency (Twice daily)"
                    value={rx.frequency}
                    onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-strong)', fontSize: '0.825rem' }}
                  />
                  <input
                    type="number"
                    min={1}
                    placeholder="Days (7)"
                    value={rx.durationDays}
                    onChange={(e) => handlePrescriptionChange(index, 'durationDays', parseInt(e.target.value) || 1)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-strong)', fontSize: '0.825rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePrescription(index)}
                    disabled={prescriptions.length === 1}
                    style={{ background: 'transparent', border: 'none', color: 'var(--danger-text)', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ padding: '12px', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <button type="button" onClick={onClose} className="pulse-btn pulse-btn-secondary" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="pulse-btn pulse-btn-primary" disabled={isSubmitting}>
              <CheckCircle size={16} />
              {isSubmitting ? 'Finalizing Consultation...' : 'Complete & Issue Digital Rx'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
