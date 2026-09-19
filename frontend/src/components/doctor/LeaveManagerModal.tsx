import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Calendar, AlertTriangle, ShieldCheck, X, CheckCircle2, History } from 'lucide-react';

interface LeaveManagerModalProps {
  onClose: () => void;
  onLeaveRegistered: () => void;
}

export const LeaveManagerModal: React.FC<LeaveManagerModalProps> = ({ onClose, onLeaveRegistered }) => {
  const [leaveDate, setLeaveDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [audits, setAudits] = useState<any[]>([]);
  const [isLoadingAudits, setIsLoadingAudits] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAudits = async () => {
    setIsLoadingAudits(true);
    try {
      const data = await api.getLeaveAudits();
      setAudits(data);
    } catch (err) {
      console.error('Failed to load leave audits:', err);
    } finally {
      setIsLoadingAudits(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDate) {
      setError('Please select a leave date.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.registerDoctorLeave({ date: leaveDate, reason });
      setResultMessage(
        `Leave registered. ${res.cancelledCount} conflicting appointment(s) were automatically cancelled and resolved.`
      );
      onLeaveRegistered();
      fetchAudits();
      setLeaveDate('');
      setReason('');
    } catch (err: any) {
      setError(err.message || 'Failed to register leave');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '680px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span className="pulse-badge pulse-badge-warning" style={{ marginBottom: '6px' }}>
              Practice Schedule Control
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Intelligent Leave & Conflict Resolver
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
          When you mark yourself on leave, PulsePoint sweeps your schedule, blocks slot booking, and <strong>automatically cancels & notifies</strong> any existing patient bookings on that date.
        </p>

        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Leave Date:
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-strong)',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-family)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Reason (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g., Medical Conference / Annual Leave"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-strong)',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-family)'
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: '10px', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '12px' }}>
              {error}
            </div>
          )}

          {resultMessage && (
            <div style={{ padding: '12px', background: 'var(--success-bg)', color: 'var(--success-text)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              {resultMessage}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="pulse-btn pulse-btn-primary" disabled={isSubmitting}>
              <Calendar size={16} />
              {isSubmitting ? 'Processing Auto-Resolution...' : 'Register Leave & Resolve Conflicts'}
            </button>
          </div>
        </form>

        {/* Audit Log Table */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <History size={16} color="var(--primary-600)" />
            Recent Leave Conflict Audits
          </h4>

          {isLoadingAudits ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading audit records...</p>
          ) : audits.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px' }}>
              No leave conflict logs recorded.
            </p>
          ) : (
            <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {audits.map((a, i) => (
                <div key={i} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#FFFFFF', fontSize: '0.825rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>Leave Date: {new Date(a.leaveDate).toLocaleDateString()}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                      (Logged {new Date(a.loggedAt).toLocaleDateString()})
                    </span>
                  </div>
                  <span className="pulse-badge pulse-badge-warning">
                    {a.cancelledAppointmentsCount} Conflicting Appts Cancelled
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
