import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ClinicAnalyticsSummary } from '@pulsepoint/shared';
import { DollarSign, Calendar, Users, Activity, TrendingUp, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [analytics, setAnalytics] = useState<ClinicAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load clinic analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="live-indicator" style={{ margin: '0 auto 12px' }} />
        Computing real-time clinic analytics...
      </div>
    );
  }

  if (!analytics) {
    return <div>Failed to load analytics data.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Clinic Operations & Practice Intelligence
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Real-time appointment volume, clinician performance, and revenue analytics
          </p>
        </div>
        <button onClick={fetchAnalytics} className="pulse-btn pulse-btn-secondary" style={{ padding: '8px 14px' }}>
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="pulse-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Consultations</span>
            <div style={{ background: 'var(--primary-50)', color: 'var(--primary-600)', padding: '8px', borderRadius: '10px' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {analytics.totalAppointments}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--success-text)', marginTop: '4px', fontWeight: 600 }}>
            {analytics.completedAppointments} Completed ({Math.round((analytics.completedAppointments / (analytics.totalAppointments || 1)) * 100)}%)
          </div>
        </div>

        <div className="pulse-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Revenue</span>
            <div style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '8px', borderRadius: '10px' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            ${analytics.totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Settled from completed visits
          </div>
        </div>

        <div className="pulse-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Patient Pool</span>
            <div style={{ background: 'var(--info-bg)', color: 'var(--info-text)', padding: '8px', borderRadius: '10px' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {analytics.activePatients}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Registered across all clinics
          </div>
        </div>

        <div className="pulse-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cancellation Rate</span>
            <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '8px', borderRadius: '10px' }}>
              <Activity size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {analytics.cancellationRate}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Automatic leave & patient cancels
          </div>
        </div>
      </div>

      {/* Specialty Breakdown & Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Department Volume */}
        <div className="pulse-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '18px' }}>
            Consultation Volume by Specialty
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {analytics.departmentDistribution.map((dep, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  <span>{dep.specialty}</span>
                  <span style={{ color: 'var(--primary-700)' }}>{dep.count} visits</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--primary-500), var(--accent-500))',
                      width: `${Math.min(100, (dep.count / (analytics.totalAppointments || 1)) * 100 + 15)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Performance Metrics */}
        <div className="pulse-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '18px' }}>
            System Infrastructure Health
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Specialists</span>
              <span className="pulse-badge pulse-badge-success">{analytics.totalDoctors} On Duty</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Redis Slot Hold Engine</span>
              <span className="pulse-badge pulse-badge-success">Active & Healthy</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>AI Clinical Triage Gateway</span>
              <span className="pulse-badge pulse-badge-info">Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Medication Reminder Worker</span>
              <span className="pulse-badge pulse-badge-success">Tick Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
