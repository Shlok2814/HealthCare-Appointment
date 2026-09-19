import React, { useState } from 'react';
import { AnalyticsView } from '../components/admin/AnalyticsView';
import { UserManagementView } from '../components/admin/UserManagementView';
import { Activity, Users, ShieldCheck } from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users'>('analytics');

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <span className="pulse-badge pulse-badge-danger" style={{ marginBottom: '6px' }}>
          <ShieldCheck size={12} /> Executive Practice Control
        </span>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Clinic Administration & Intelligence
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Comprehensive clinic health monitoring, department workload balance, and user authorization
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid var(--border-light)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'transparent',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'analytics' ? 'var(--primary-600)' : 'var(--text-muted)',
            borderBottom: activeTab === 'analytics' ? '2px solid var(--primary-600)' : 'none',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          <Activity size={18} /> Practice Analytics & Revenue
        </button>

        <button
          onClick={() => setActiveTab('users')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'transparent',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'users' ? 'var(--primary-600)' : 'var(--text-muted)',
            borderBottom: activeTab === 'users' ? '2px solid var(--primary-600)' : 'none',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          <Users size={18} /> User & Clinician Directory
        </button>
      </div>

      {/* Content */}
      {activeTab === 'analytics' ? <AnalyticsView /> : <UserManagementView />}
    </div>
  );
};
