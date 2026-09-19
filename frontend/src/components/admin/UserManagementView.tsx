import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, Shield, Stethoscope, User, CheckCircle2, XCircle, Search, RefreshCw } from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminUsers(roleFilter);
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (userId: string) => {
    try {
      await api.toggleUserStatus(userId);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(u => 
    (u.name || '').toLowerCase().includes((search || '').toLowerCase()) ||
    (u.email || '').toLowerCase().includes((search || '').toLowerCase())
  ) : [];

  return (
    <div className="pulse-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="var(--primary-600)" />
            Staff & Patient Directory
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage role permissions and active access status across the ecosystem
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-strong)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-family)',
                minWidth: '220px'
              }}
            />
            <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1.5px solid var(--border-strong)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-family)'
            }}
          >
            <option value="">All Roles</option>
            <option value="PATIENT">Patients</option>
            <option value="DOCTOR">Doctors</option>
            <option value="ADMIN">Admins</option>
          </select>

          <button onClick={fetchUsers} className="pulse-btn pulse-btn-secondary" style={{ padding: '8px', borderRadius: '8px' }}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading user records...
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>User</th>
                <th style={{ padding: '12px 16px' }}>Role</th>
                <th style={{ padding: '12px 16px' }}>Contact</th>
                <th style={{ padding: '12px 16px' }}>Joined Date</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {u.role === 'ADMIN' ? (
                      <span className="pulse-badge pulse-badge-danger"><Shield size={12} /> Admin</span>
                    ) : u.role === 'DOCTOR' ? (
                      <span className="pulse-badge pulse-badge-info"><Stethoscope size={12} /> Doctor</span>
                    ) : (
                      <span className="pulse-badge pulse-badge-neutral"><User size={12} /> Patient</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    {u.phone || '—'}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {u.isActive ? (
                      <span className="pulse-badge pulse-badge-success">Active</span>
                    ) : (
                      <span className="pulse-badge pulse-badge-neutral">Disabled</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`pulse-btn ${u.isActive ? 'pulse-btn-danger' : 'pulse-btn-secondary'}`}
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
