import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Pill, Clock, CheckCircle2, Bell, AlertCircle, RefreshCw } from 'lucide-react';

export const MedicationVault: React.FC = () => {
  const [medications, setMedications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMedications = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMedicationAlerts();
      setMedications(data);
    } catch (err) {
      console.error('Failed to load medication vault:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const formatAlertTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="pulse-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Pill size={20} color="var(--primary-600)" />
            Medication Vault & Automated Reminders
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Synchronized prescription schedules and automated SMS/Email reminder alerts
          </p>
        </div>
        <button onClick={fetchMedications} className="pulse-btn pulse-btn-secondary" style={{ padding: '8px', borderRadius: '8px' }}>
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading active medications...
        </div>
      ) : medications.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: '12px' }}>
          <CheckCircle2 size={32} color="var(--primary-600)" style={{ margin: '0 auto 8px' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>No Active Reminders</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Prescriptions issued during consultations will automatically generate daily reminder timelines here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {medications.map((alert, index) => (
            <div
              key={alert.id || index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                background: alert.isSent ? 'var(--bg-subtle)' : '#FFFFFF',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  background: alert.isSent ? 'var(--success-bg)' : 'var(--primary-50)',
                  color: alert.isSent ? 'var(--success-text)' : 'var(--primary-700)',
                  padding: '10px',
                  borderRadius: '10px'
                }}>
                  <Pill size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {alert.medicationName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Clock size={12} /> Scheduled daily trigger: {formatAlertTime(alert.scheduledTime)}
                  </div>
                </div>
              </div>

              <div>
                {alert.isSent ? (
                  <span className="pulse-badge pulse-badge-success">
                    <CheckCircle2 size={12} /> Reminder Sent
                  </span>
                ) : (
                  <span className="pulse-badge pulse-badge-info">
                    <Bell size={12} /> Active Queue
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
