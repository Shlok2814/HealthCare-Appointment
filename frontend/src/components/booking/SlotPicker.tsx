import React, { useState, useEffect } from 'react';
import { AvailableSlot } from '@pulsepoint/shared';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, AlertCircle, Lock, CheckCircle2, RefreshCw } from 'lucide-react';

interface SlotPickerProps {
  doctorId: string;
  doctorName: string;
  onSlotSelected: (slot: AvailableSlot, holdData?: any) => void;
  selectedSlot: AvailableSlot | null;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({ doctorId, doctorName, onSlotSelected, selectedSlot }) => {
  const { user } = useAuth();
  
  // Format today's date in YYYY-MM-DD
  const getInitialDate = () => {
    const d = new Date();
    // Default to tomorrow for booking demo
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getInitialDate());
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [holdTimerSeconds, setHoldTimerSeconds] = useState<number | null>(null);
  const [activeHoldId, setActiveHoldId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSlots = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await api.getAvailableSlots(doctorId, selectedDate, user?.id);
      setSlots(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch schedule slots');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [doctorId, selectedDate]);

  // Hold countdown timer
  useEffect(() => {
    let interval: any = null;
    if (holdTimerSeconds !== null && holdTimerSeconds > 0) {
      interval = setInterval(() => {
        setHoldTimerSeconds(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (holdTimerSeconds === 0) {
      setActiveHoldId(null);
      setHoldTimerSeconds(null);
      fetchSlots();
    }
    return () => clearInterval(interval);
  }, [holdTimerSeconds]);

  const handleSlotClick = async (slot: AvailableSlot) => {
    if (!slot.isAvailable && !slot.heldByCurrentUser) return;
    if (!user) {
      alert('Please sign in or choose a demo account to reserve a slot.');
      return;
    }

    setIsHolding(true);
    setErrorMessage(null);

    try {
      const hold = await api.holdSlot({
        doctorId,
        slotStart: slot.slotStart,
        slotEnd: slot.slotEnd
      });

      setActiveHoldId(hold.id);
      setHoldTimerSeconds(300); // 5 minutes countdown
      onSlotSelected(slot, hold);
      await fetchSlots();
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to hold slot');
    } finally {
      setIsHolding(false);
    }
  };

  const formatSlotTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="pulse-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="var(--primary-600)" />
            Select Appointment Slot
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Practice schedule for {doctorName}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1.5px solid var(--border-strong)',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-family)'
            }}
          />
          <button
            onClick={fetchSlots}
            className="pulse-btn pulse-btn-secondary"
            title="Refresh availability"
            style={{ padding: '8px', borderRadius: '8px' }}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Hold countdown alert */}
      {holdTimerSeconds !== null && holdTimerSeconds > 0 && (
        <div style={{
          background: 'var(--primary-50)',
          border: '1.5px solid var(--primary-300)',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="live-indicator" />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-800)' }}>
              Slot Temporarily Locked for You
            </span>
          </div>
          <div style={{ background: 'var(--primary-600)', color: '#FFFFFF', padding: '4px 12px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem' }}>
            Hold expires in: {formatCountdown(holdTimerSeconds)}
          </div>
        </div>
      )}

      {/* Slot legend */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, border: '1.5px solid var(--border-strong)', background: '#FFFFFF' }} />
          <span>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--primary-600)' }} />
          <span>Selected & Held</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: '#FEF3C7', border: '1px solid #FCD34D' }} />
          <span>Held by Other Patient</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--bg-subtle)' }} />
          <span>Booked</span>
        </div>
      </div>

      {errorMessage && (
        <div style={{ padding: '12px', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="live-indicator" style={{ margin: '0 auto 12px' }} />
          Scanning real-time clinic slots...
        </div>
      ) : slots.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-subtle)', borderRadius: '12px' }}>
          <AlertCircle size={28} style={{ margin: '0 auto 8px', color: 'var(--text-light)' }} />
          <p style={{ fontWeight: 600 }}>No slots available on this date.</p>
          <p style={{ fontSize: '0.825rem' }}>Doctor may be on scheduled leave or outside practicing hours.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
          {slots.map((slot, index) => {
            const isSelected = selectedSlot?.slotStart === slot.slotStart;
            let btnClass = 'slot-btn';

            if (isSelected) {
              btnClass += ' selected';
            } else if (slot.heldByCurrentUser) {
              btnClass += ' held-by-me';
            } else if (slot.isHeld) {
              btnClass += ' held-by-others';
            } else if (!slot.isAvailable) {
              btnClass += ' booked';
            }

            return (
              <button
                key={index}
                className={btnClass}
                disabled={(!slot.isAvailable && !slot.heldByCurrentUser) || isHolding}
                onClick={() => handleSlotClick(slot)}
              >
                <span style={{ fontSize: '0.88rem' }}>{formatSlotTime(slot.slotStart)}</span>
                <span style={{ fontSize: '0.68rem', opacity: 0.85, marginTop: '2px' }}>
                  {slot.isHeld && !slot.heldByCurrentUser ? 'Held (Locked)' : slot.isAvailable ? 'Open' : isSelected ? 'Held for you' : 'Booked'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
