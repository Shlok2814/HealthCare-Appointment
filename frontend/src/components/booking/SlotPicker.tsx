import React, { useState, useEffect } from 'react';
import { AvailableSlot } from '@pulsepoint/shared';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, AlertCircle, CheckCircle2, RefreshCw, X, MessageSquare, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';

interface SlotPickerProps {
  doctorId: string;
  doctorName: string;
  doctorSpecialization?: string;
  consultationFee?: number;
  onSlotSelected: (slot: AvailableSlot, holdData?: any) => void;
  selectedSlot: AvailableSlot | null;
  onClose?: () => void;
  onOpenMessage?: () => void;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({ 
  doctorId, 
  doctorName, 
  doctorSpecialization,
  consultationFee,
  onSlotSelected, 
  selectedSlot,
  onClose,
  onOpenMessage
}) => {
  const { user } = useAuth();
  
  // Format today's date in YYYY-MM-DD
  const getInitialDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Default to tomorrow
    return d.toISOString().split('T')[0];
  };

  const generateLocalSlots = (date: string): AvailableSlot[] => {
    const generatedSlots: AvailableSlot[] = [];
    const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    for (const t of times) {
      const startIso = `${date}T${t}:00.000Z`;
      const [hh, mm] = t.split(':').map(Number);
      const endMins = mm + 30;
      const endHh = endMins >= 60 ? hh + 1 : hh;
      const finalMm = endMins >= 60 ? endMins - 60 : endMins;
      const endIso = `${date}T${String(endHh).padStart(2, '0')}:${String(finalMm).padStart(2, '0')}:00.000Z`;
      
      generatedSlots.push({
        slotStart: startIso,
        slotEnd: endIso,
        isAvailable: true,
        isHeld: false
      });
    }
    return generatedSlots;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getInitialDate());
  const [slots, setSlots] = useState<AvailableSlot[]>(() => generateLocalSlots(getInitialDate()));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [holdTimerSeconds, setHoldTimerSeconds] = useState<number | null>(null);
  const [activeHoldId, setActiveHoldId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSlots = async () => {
    setErrorMessage(null);
    try {
      const data = await api.getAvailableSlots(doctorId, selectedDate, user?.id);
      if (Array.isArray(data) && data.length > 0) {
        setSlots(data);
      }
    } catch (err: any) {
      // Background revalidation fallback
    }
  };

  useEffect(() => {
    setSlots(generateLocalSlots(selectedDate));
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
      alert('Please sign in or select a demo account to reserve your slot.');
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
      setErrorMessage(err.message || 'Unable to lock appointment slot');
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

  // Helper for quick date chips
  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const todayIso = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowIso = tomorrowDate.toISOString().split('T')[0];

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '20px',
      border: '1.5px solid #E2E8F0',
      boxShadow: '0 12px 36px -6px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(2, 132, 199, 0.08)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '420px',
      margin: '0 auto',
      transition: 'all 0.3s ease'
    }}>
      {/* Sleek Gradient Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 55%, #0369A1 100%)',
        padding: '16px 18px',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284C7, #0D9488)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.05rem',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            {doctorName.replace('Dr. ', '').charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#7DD3FC', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Schedule Slot
            </div>
            <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
              {doctorName}
            </h4>
            <div style={{ fontSize: '0.74rem', color: '#E2E8F0', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{doctorSpecialization || 'Specialist'}</span>
              {consultationFee && (
                <span style={{ background: 'rgba(255,255,255,0.18)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  ₹{consultationFee}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {onOpenMessage && (
            <button
              type="button"
              onClick={onOpenMessage}
              title="Direct Chat with Doctor"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MessageSquare size={14} />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close slot picker"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: '16px 18px' }}>
        {/* Date Selector & Quick Pills */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Consultation Date
            </span>
            <button
              type="button"
              onClick={fetchSlots}
              className="pulse-btn"
              title="Refresh Slots"
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                padding: '3px 7px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#0369A1',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={11} className={isLoading ? 'pulse-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Quick Date Chips */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <button
              type="button"
              onClick={() => setQuickDate(0)}
              style={{
                flex: 1,
                padding: '5px 6px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: selectedDate === todayIso ? '1.5px solid #0284C7' : '1px solid #E2E8F0',
                background: selectedDate === todayIso ? '#EFF6FF' : '#F8FAFC',
                color: selectedDate === todayIso ? '#0284C7' : 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(1)}
              style={{
                flex: 1,
                padding: '5px 6px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: selectedDate === tomorrowIso ? '1.5px solid #0284C7' : '1px solid #E2E8F0',
                background: selectedDate === tomorrowIso ? '#EFF6FF' : '#F8FAFC',
                color: selectedDate === tomorrowIso ? '#0284C7' : 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(2)}
              style={{
                flex: 1,
                padding: '5px 6px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: selectedDate !== todayIso && selectedDate !== tomorrowIso ? '1.5px solid #0284C7' : '1px solid #E2E8F0',
                background: selectedDate !== todayIso && selectedDate !== tomorrowIso ? '#EFF6FF' : '#F8FAFC',
                color: selectedDate !== todayIso && selectedDate !== tomorrowIso ? '#0284C7' : 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              +2 Days
            </button>
          </div>

          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: '8px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              background: '#FFFFFF',
              fontFamily: 'var(--font-family)',
              outline: 'none'
            }}
          />
        </div>

        {/* Hold Countdown Live Banner */}
        {holdTimerSeconds !== null && holdTimerSeconds > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #ECFDF5 100%)',
            border: '1.5px solid #86EFAC',
            borderRadius: '10px',
            padding: '8px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div className="live-indicator" />
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#166534' }}>
                Slot Reserved
              </span>
            </div>
            <div style={{ background: '#059669', color: '#FFFFFF', padding: '2px 8px', borderRadius: '12px', fontWeight: 900, fontSize: '0.74rem' }}>
              Expires: {formatCountdown(holdTimerSeconds)}
            </div>
          </div>
        )}

        {/* Compact Legend */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '4px', 
          marginBottom: '14px', 
          padding: '6px', 
          background: '#F8FAFC', 
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '0.66rem',
          fontWeight: 700,
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }} />
            <span>Open</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284C7' }} />
            <span style={{ color: '#0284C7' }}>Selected</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
            <span style={{ color: '#B45309' }}>Held</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#CBD5E1' }} />
            <span>Booked</span>
          </div>
        </div>

        {errorMessage && (
          <div style={{ padding: '8px 10px', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '0.76rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Continuous Rotation & Loop Roster Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)',
          border: '1px solid #BAE6FD',
          borderRadius: '10px',
          padding: '8px 10px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={15} color="#0284C7" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.72rem', color: '#0F172A', lineHeight: 1.35 }}>
            <span style={{ fontWeight: 800, color: '#0369A1' }}>Continuous On-Call Rotation:</span> Slots auto-renew in a 24/7 loop. Even after hours, coverage seamlessly rolls forward.
          </div>
        </div>

        {/* Slot Grid with Tier Headers */}
        {isLoading ? (
          <div style={{ padding: '28px 12px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={20} className="pulse-spin" style={{ color: '#0284C7', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Loading clinic schedule...</div>
          </div>
        ) : slots.length === 0 ? (
          <div style={{ padding: '22px 12px', textAlign: 'center', color: 'var(--text-muted)', background: '#F8FAFC', borderRadius: '10px', border: '1px dashed #CBD5E1' }}>
            <Calendar size={20} style={{ margin: '0 auto 4px', color: '#94A3B8' }} />
            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-main)' }}>No Slots on this Date</div>
            <div style={{ fontSize: '0.72rem', marginTop: '2px' }}>Choose another date above.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto', paddingRight: '2px' }}>
            {['Morning Rounds', 'Afternoon Clinic', 'Evening Telehealth', 'Night Urgent Care'].map((tierName) => {
              const tierSlots = slots.filter(s => (s.tier || 'Morning Rounds') === tierName);
              if (tierSlots.length === 0) return null;

              return (
                <div key={tierName} style={{ background: '#F8FAFC', padding: '8px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{tierName === 'Morning Rounds' ? '☀️ Morning Rounds (08:30 - 12:00)' : tierName === 'Afternoon Clinic' ? '⛅ Afternoon Clinic (13:30 - 17:00)' : tierName === 'Evening Telehealth' ? '🌙 Evening Telehealth (17:30 - 20:30)' : '⚡ 24/7 Urgent Telehealth (21:00 - 22:30)'}</span>
                    <span style={{ fontSize: '0.64rem', color: '#0284C7', fontWeight: 700 }}>{tierSlots.filter(s => s.isAvailable).length} open</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                    {tierSlots.map((slot, index) => {
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
                          type="button"
                          className={btnClass}
                          disabled={(!slot.isAvailable && !slot.heldByCurrentUser) || isHolding}
                          onClick={() => handleSlotClick(slot)}
                          style={{ minHeight: '40px', padding: '4px 2px' }}
                        >
                          <span style={{ fontSize: '0.76rem', fontWeight: 800 }}>{formatSlotTime(slot.slotStart)}</span>
                          <span style={{ fontSize: '0.6rem', marginTop: '1px', fontWeight: 700 }}>
                            {isSelected ? '✓ Selected' : slot.isHeld && !slot.heldByCurrentUser ? 'Held' : slot.isAvailable ? 'Open' : slot.isAutoRenewed ? 'Renewed' : 'Booked'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Slot Call to Action */}
        {selectedSlot && (
          <div style={{ marginTop: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              padding: '8px 10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <div>
                <div style={{ fontSize: '0.66rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase' }}>Selected Time</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 900, color: '#166534' }}>
                  {formatSlotTime(selectedSlot.slotStart)}
                </div>
              </div>
              <CheckCircle2 size={18} color="#16A34A" />
            </div>

            <button
              type="button"
              onClick={() => onSlotSelected(selectedSlot)}
              className="pulse-btn pulse-btn-primary"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.84rem',
                fontWeight: 800,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <span>Confirm & Start Intake</span>
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
