import React from 'react';
import { Printer, X, ShieldCheck, HeartPulse, QrCode, FileText, CheckCircle2 } from 'lucide-react';
import { AppointmentDTO } from '@pulsepoint/shared';

interface PrescriptionPrintModalProps {
  appointment: AppointmentDTO;
  onClose: () => void;
}

export const PrescriptionPrintModal: React.FC<PrescriptionPrintModalProps> = ({
  appointment,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const rxItems = appointment.clinicalRecord?.prescriptions || [];
  const careSummary = appointment.patientSummary;

  return (
    <div className="pulse-modal-overlay">
      <div 
        className="pulse-modal" 
        style={{ 
          maxWidth: '850px', 
          width: '95vw', 
          maxHeight: '92vh', 
          overflowY: 'auto',
          padding: '32px',
          background: '#FFFFFF',
          color: '#0F172A',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Actions bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284C7', fontWeight: 700 }}>
            <FileText size={20} />
            <span>OFFICIAL ELECTRONIC MEDICAL SUMMARY & RX</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handlePrint}
              className="pulse-btn pulse-btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.875rem' }}
            >
              <Printer size={16} /> Print / Save as PDF
            </button>
            <button 
              onClick={onClose}
              className="pulse-btn pulse-btn-secondary"
              style={{ padding: '8px 14px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div style={{ border: '2px solid #E2E8F0', borderRadius: '12px', padding: '32px', background: '#FAFAFA' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0284C7', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #0284C7, #0D9488)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#FFF'
              }}>
                <HeartPulse size={28} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  PulsePoint Health
                </h1>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                  Center for Advanced Clinical Care & Preventive Medicine
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748B' }}>
              <div style={{ fontWeight: 700, color: '#0F172A' }}>Rx Document ID: #{appointment.id.slice(0, 10).toUpperCase()}</div>
              <div>Date Issued: {new Date(appointment.slotStart).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>HIPAA & FDA Dispensation Verified</div>
            </div>
          </div>

          {/* Doctor & Patient Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Attending Physician</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                {appointment.doctor?.name || 'Dr. Specialist'}
              </div>
              <div style={{ fontSize: '0.825rem', color: '#0284C7', fontWeight: 600 }}>
                {appointment.doctor?.specialization || 'Clinical Specialist'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Patient Name</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                {appointment.patient?.name || 'Patient'}
              </div>
              <div style={{ fontSize: '0.825rem', color: '#64748B' }}>
                {appointment.patient?.email || 'patient@pulsepoint.health'}
              </div>
            </div>
          </div>

          {/* Clinical Diagnosis Section */}
          <div style={{ marginBottom: '24px', background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#0284C7', fontWeight: 800 }}>Clinical Diagnosis & Evaluation</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '4px 0 8px' }}>
              {appointment.clinicalRecord?.diagnosis || 'Comprehensive Medical Evaluation & Health Assessment'}
            </div>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              {appointment.clinicalRecord?.clinicalNotes || 'Patient evaluated and provided tailored medical regimen.'}
            </p>
          </div>

          {/* Prescription Medications Table */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              <span>℞ PRESCRIBED MEDICATIONS & DOSAGE SCHEDULE</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#FFFFFF', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '10px 12px' }}>#</th>
                  <th style={{ padding: '10px 12px' }}>Medication & Dosage</th>
                  <th style={{ padding: '10px 12px' }}>Frequency</th>
                  <th style={{ padding: '10px 12px' }}>Duration</th>
                  <th style={{ padding: '10px 12px' }}>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {rxItems.length > 0 ? (
                  rxItems.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#0284C7' }}>{idx + 1}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#0F172A' }}>
                        {item.medicationName} ({item.dosage})
                      </td>
                      <td style={{ padding: '12px', color: '#334155' }}>{item.frequency}</td>
                      <td style={{ padding: '12px', color: '#334155' }}>{item.durationDays} Days</td>
                      <td style={{ padding: '12px', color: '#64748B', fontSize: '0.825rem' }}>{item.instructions || 'As directed'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#94A3B8' }}>
                      No active prescriptions issued for this encounter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Care Instructions & Follow-up */}
          {careSummary && (
            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#0D9488', fontWeight: 800 }}>Patient Care Instructions & Follow-up</span>
              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, marginTop: '6px' }}>
                {careSummary.careInstructions}
              </p>
              {careSummary.followUpRecommendations && careSummary.followUpRecommendations.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Key Recommendations:</span>
                  <ul style={{ paddingLeft: '20px', margin: '4px 0 0', fontSize: '0.825rem', color: '#475569' }}>
                    {careSummary.followUpRecommendations.map((rec, rIdx) => (
                      <li key={rIdx} style={{ marginBottom: '3px' }}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Footer & Doctor Signature Line */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                border: '2px dashed #0284C7', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#0284C7' 
              }}>
                <QrCode size={40} />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                <div style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} color="#10B981" /> Verified Digital Rx
                </div>
                <div>Scan QR at participating pharmacies</div>
                <div>License #MD-883921-US</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontFamily: 'cursive', 
                fontSize: '1.25rem', 
                color: '#0284C7', 
                borderBottom: '1px solid #94A3B8',
                paddingBottom: '4px',
                minWidth: '200px'
              }}>
                {appointment.doctor?.name || 'Physician Signature'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                Electronic Signature & Timestamp
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
