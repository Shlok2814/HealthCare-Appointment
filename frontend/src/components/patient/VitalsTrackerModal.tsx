import React, { useState } from 'react';
import { 
  Activity, Heart, Droplets, Wind, Scale, Plus, 
  CheckCircle, AlertTriangle, TrendingUp, Calendar, X 
} from 'lucide-react';
import { VitalsRecord } from '@pulsepoint/shared';

interface VitalsTrackerModalProps {
  patientName: string;
  onClose: () => void;
}

export const VitalsTrackerModal: React.FC<VitalsTrackerModalProps> = ({
  patientName,
  onClose
}) => {
  const [vitalsList, setVitalsList] = useState<VitalsRecord[]>([
    {
      id: '1',
      patientId: 'patient1',
      recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      systolicBp: 128,
      diastolicBp: 82,
      heartRate: 74,
      bloodGlucose: 98,
      oxygenSpO2: 99,
      weightKg: 72.5,
      notes: 'Morning measurement before breakfast'
    },
    {
      id: '2',
      patientId: 'patient1',
      recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      systolicBp: 134,
      diastolicBp: 86,
      heartRate: 78,
      bloodGlucose: 104,
      oxygenSpO2: 98,
      weightKg: 73.0,
      notes: 'Evening checkup post exercise'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSystolic, setNewSystolic] = useState('120');
  const [newDiastolic, setNewDiastolic] = useState('80');
  const [newHeartRate, setNewHeartRate] = useState('72');
  const [newGlucose, setNewGlucose] = useState('95');
  const [newSpO2, setNewSpO2] = useState('99');
  const [newWeight, setNewWeight] = useState('72.0');
  const [newNotes, setNewNotes] = useState('');

  const handleAddVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: VitalsRecord = {
      id: Date.now().toString(),
      patientId: 'patient1',
      recordedAt: new Date().toISOString(),
      systolicBp: Number(newSystolic),
      diastolicBp: Number(newDiastolic),
      heartRate: Number(newHeartRate),
      bloodGlucose: Number(newGlucose),
      oxygenSpO2: Number(newSpO2),
      weightKg: Number(newWeight),
      notes: newNotes || 'Routine home vital signs log'
    };

    setVitalsList([entry, ...vitalsList]);
    setShowAddForm(false);
    setNewNotes('');
  };

  const latest = vitalsList[0];

  const getBpStatus = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: 'Optimal Normal', color: '#10B981', bg: '#D1FAE5' };
    if (sys <= 129 && dia < 80) return { label: 'Elevated Normal', color: '#D97706', bg: '#FEF3C7' };
    if (sys <= 139 || dia <= 89) return { label: 'Stage 1 Mild', color: '#EA580C', bg: '#FFEDD5' };
    return { label: 'High / Review Required', color: '#DC2626', bg: '#FEE2E2' };
  };

  const bpStatus = latest ? getBpStatus(latest.systolicBp, latest.diastolicBp) : { label: 'Normal', color: '#10B981', bg: '#D1FAE5' };

  return (
    <div className="pulse-modal-overlay">
      <div 
        className="pulse-modal" 
        style={{ 
          maxWidth: '850px', 
          width: '92vw', 
          maxHeight: '90vh', 
          overflowY: 'auto',
          padding: '28px',
          borderRadius: '16px' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Activity size={18} />
              <span>DIGITAL BIOMETRIC HEALTH VAULT</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
              Vital Signs & Biomarkers: {patientName}
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-muted)', 
              padding: '4px' 
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Latest Vitals Snapshot Cards */}
        {latest && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            {/* Blood Pressure */}
            <div className="pulse-card" style={{ padding: '16px', borderLeft: `4px solid ${bpStatus.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                <Heart size={14} color="#EF4444" />
                <span>BLOOD PRESSURE</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0 2px' }}>
                {latest.systolicBp}/{latest.diastolicBp} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>mmHg</span>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: bpStatus.color, background: bpStatus.bg, padding: '2px 6px', borderRadius: '4px' }}>
                {bpStatus.label}
              </span>
            </div>

            {/* Heart Rate */}
            <div className="pulse-card" style={{ padding: '16px', borderLeft: '4px solid #EC4899' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                <Activity size={14} color="#EC4899" />
                <span>HEART RATE</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0 2px' }}>
                {latest.heartRate} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>BPM</span>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981', background: '#D1FAE5', padding: '2px 6px', borderRadius: '4px' }}>
                Resting Normal
              </span>
            </div>

            {/* Blood Glucose */}
            <div className="pulse-card" style={{ padding: '16px', borderLeft: '4px solid #3B82F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                <Droplets size={14} color="#3B82F6" />
                <span>BLOOD GLUCOSE</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0 2px' }}>
                {latest.bloodGlucose} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>mg/dL</span>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981', background: '#D1FAE5', padding: '2px 6px', borderRadius: '4px' }}>
                Fasting In Range
              </span>
            </div>

            {/* SpO2 */}
            <div className="pulse-card" style={{ padding: '16px', borderLeft: '4px solid #06B6D4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                <Wind size={14} color="#06B6D4" />
                <span>PULSE OX (SpO2)</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0 2px' }}>
                {latest.oxygenSpO2}%
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981', background: '#D1FAE5', padding: '2px 6px', borderRadius: '4px' }}>
                Optimal Oxygen
              </span>
            </div>

            {/* Weight */}
            <div className="pulse-card" style={{ padding: '16px', borderLeft: '4px solid #8B5CF6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                <Scale size={14} color="#8B5CF6" />
                <span>BODY WEIGHT</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0 2px' }}>
                {latest.weightKg} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>kg</span>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6366F1', background: '#EEF2FF', padding: '2px 6px', borderRadius: '4px' }}>
                BMI 23.4 (Healthy)
              </span>
            </div>
          </div>
        )}

        {/* Action button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Historical Biometric Logs
          </h3>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="pulse-btn pulse-btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.875rem' }}
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Cancel Logging' : 'Log New Reading'}</span>
          </button>
        </div>

        {/* New Vitals Form */}
        {showAddForm && (
          <form 
            onSubmit={handleAddVitals}
            className="pulse-card" 
            style={{ 
              padding: '20px', 
              background: 'var(--bg-subtle)', 
              marginBottom: '24px',
              border: '1px solid var(--primary-200)'
            }}
          >
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--primary-800)' }}>
              Record New Vital Measurement
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="pulse-label">Systolic (mmHg)</label>
                <input 
                  type="number" 
                  className="pulse-input" 
                  value={newSystolic} 
                  onChange={e => setNewSystolic(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="pulse-label">Diastolic (mmHg)</label>
                <input 
                  type="number" 
                  className="pulse-input" 
                  value={newDiastolic} 
                  onChange={e => setNewDiastolic(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="pulse-label">Heart Rate (BPM)</label>
                <input 
                  type="number" 
                  className="pulse-input" 
                  value={newHeartRate} 
                  onChange={e => setNewHeartRate(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="pulse-label">Glucose (mg/dL)</label>
                <input 
                  type="number" 
                  className="pulse-input" 
                  value={newGlucose} 
                  onChange={e => setNewGlucose(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="pulse-label">Oxygen SpO2 (%)</label>
                <input 
                  type="number" 
                  className="pulse-input" 
                  value={newSpO2} 
                  onChange={e => setNewSpO2(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="pulse-label">Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="pulse-input" 
                  value={newWeight} 
                  onChange={e => setNewWeight(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label className="pulse-label">Observation Notes (Optional)</label>
              <input 
                type="text" 
                className="pulse-input" 
                placeholder="e.g. Taken post 30-min walking exercise" 
                value={newNotes} 
                onChange={e => setNewNotes(e.target.value)} 
              />
            </div>

            <button type="submit" className="pulse-btn pulse-btn-primary" style={{ width: '100%' }}>
              <CheckCircle size={16} /> Save Vitals Log
            </button>
          </form>
        )}

        {/* Vitals History Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>Date & Time</th>
                <th style={{ padding: '10px' }}>BP (SYS/DIA)</th>
                <th style={{ padding: '10px' }}>Heart Rate</th>
                <th style={{ padding: '10px' }}>Blood Sugar</th>
                <th style={{ padding: '10px' }}>SpO2</th>
                <th style={{ padding: '10px' }}>Weight</th>
                <th style={{ padding: '10px' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {vitalsList.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {new Date(v.recordedAt).toLocaleDateString()} {new Date(v.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 700 }}>
                    {v.systolicBp}/{v.diastolicBp} mmHg
                  </td>
                  <td style={{ padding: '12px 10px' }}>{v.heartRate} BPM</td>
                  <td style={{ padding: '12px 10px' }}>{v.bloodGlucose} mg/dL</td>
                  <td style={{ padding: '12px 10px' }}>{v.oxygenSpO2}%</td>
                  <td style={{ padding: '12px 10px' }}>{v.weightKg} kg</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{v.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
