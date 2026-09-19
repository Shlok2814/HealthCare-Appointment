import React, { useState, useEffect } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, 
  Send, Shield, Activity, Clock, Users, Maximize2, Share2, Sparkles, HeartPulse
} from 'lucide-react';
import { AppointmentDTO } from '@pulsepoint/shared';

interface TelehealthRoomModalProps {
  appointment: AppointmentDTO;
  userRole: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  isDoctor: boolean;
  text: string;
  time: string;
}

export const TelehealthRoomModal: React.FC<TelehealthRoomModalProps> = ({
  appointment,
  userRole,
  onClose
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(142);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Dr. Clinical Assistant (AI)',
      isDoctor: true,
      text: 'Encrypted HD Telehealth session established. Clinical intake & triage notes synced.',
      time: '10:00 AM'
    },
    {
      id: '2',
      sender: userRole === 'DOCTOR' ? 'Patient' : (appointment.doctor?.name || 'Doctor'),
      isDoctor: userRole !== 'DOCTOR',
      text: userRole === 'DOCTOR' 
        ? 'Hello Doctor, I am online and can hear you clearly.' 
        : 'Good day, I am reviewing your symptom intake right now. How are you feeling today?',
      time: '10:01 AM'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: userRole === 'DOCTOR' ? (appointment.doctor?.name || 'Doctor') : (appointment.patient?.name || 'Patient'),
      isDoctor: userRole === 'DOCTOR',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  const otherParticipantName = userRole === 'DOCTOR' 
    ? (appointment.patient?.name || 'Alex Reynolds') 
    : (appointment.doctor?.name || 'Dr. Specialist');

  return (
    <div className="pulse-modal-overlay">
      <div 
        className="pulse-modal" 
        style={{ 
          maxWidth: '1200px', 
          width: '95vw', 
          height: '88vh', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: 0, 
          background: '#0F172A',
          color: '#F8FAFC',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #334155'
        }}
      >
        {/* Header Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px 24px', 
          background: '#1E293B', 
          borderBottom: '1px solid #334155' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: '#10B981', 
              boxShadow: '0 0 10px #10B981' 
            }} />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Telehealth Consultation: {otherParticipantName}</span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  background: 'rgba(16, 185, 129, 0.2)', 
                  color: '#34D399', 
                  padding: '2px 8px', 
                  borderRadius: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Shield size={12} /> HIPAA Encrypted
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                {appointment.doctor?.specialization || 'Clinical Review'} • Room ID: {appointment.id.slice(0, 8)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: '#0F172A', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              border: '1px solid #334155',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#38BDF8'
            }}>
              <Clock size={16} />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>
            <button 
              onClick={() => setShowChat(!showChat)}
              className="pulse-btn"
              style={{ 
                background: showChat ? '#2563EB' : '#334155', 
                color: '#FFFFFF', 
                padding: '8px 14px', 
                fontSize: '0.85rem' 
              }}
            >
              <MessageSquare size={16} />
              <span>Chat</span>
            </button>
          </div>
        </div>

        {/* Video & Chat Main Stage */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Main Video Screen */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative', 
            background: '#090D16', 
            padding: '16px' 
          }}>
            {/* Primary Remote Video Area */}
            <div style={{ 
              flex: 1, 
              borderRadius: '12px', 
              background: 'radial-gradient(circle at center, #1E293B 0%, #0B1120 100%)', 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden',
              border: '1px solid #1E293B'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #0284C7, #0D9488)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 32px rgba(13, 148, 136, 0.4)'
                }}>
                  {otherParticipantName.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '6px' }}>
                  {otherParticipantName}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10B981', fontSize: '0.85rem' }}>
                  <Activity size={14} className="pulse-spin-slow" />
                  <span>HD Video & Audio Active (1080p 60fps)</span>
                </div>
              </div>

              {/* Patient Self-View PIP (Picture in Picture) */}
              <div style={{ 
                position: 'absolute', 
                bottom: '20px', 
                right: '20px', 
                width: '180px', 
                height: '120px', 
                borderRadius: '10px', 
                background: isVideoOff ? '#1E293B' : 'linear-gradient(135deg, #334155, #1E293B)', 
                border: '2px solid #0284C7',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {isVideoOff ? (
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textAlign: 'center' }}>
                    <VideoOff size={24} color="#EF4444" style={{ margin: '0 auto 4px' }} />
                    Camera Muted
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: '#2563EB', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#FFF',
                      margin: '0 auto 4px'
                    }}>
                      {userRole === 'DOCTOR' ? 'Dr' : 'You'}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>You (Self View)</span>
                  </div>
                )}
              </div>

              {/* Triage Info Banner Overlay */}
              <div style={{ 
                position: 'absolute', 
                top: '16px', 
                left: '16px', 
                background: 'rgba(15, 23, 42, 0.85)', 
                backdropFilter: 'blur(8px)',
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid #334155',
                maxWidth: '380px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700, marginBottom: '4px' }}>
                  <Sparkles size={14} />
                  <span>AI CLINICAL INTAKE SYNOPSIS</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#E2E8F0', fontWeight: 600, lineHeight: 1.4 }}>
                  {appointment.triageAssessment?.primaryConcern || appointment.symptomIntake?.symptomsDescription || 'Routine checkup and clinical evaluation.'}
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '16px', 
              paddingTop: '16px' 
            }}>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="pulse-btn"
                style={{ 
                  background: isMuted ? '#EF4444' : '#334155', 
                  color: '#FFFFFF', 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  padding: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: isMuted ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none'
                }}
                title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button 
                onClick={() => setIsVideoOff(!isVideoOff)}
                className="pulse-btn"
                style={{ 
                  background: isVideoOff ? '#EF4444' : '#334155', 
                  color: '#FFFFFF', 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  padding: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: isVideoOff ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none'
                }}
                title={isVideoOff ? 'Start Camera' : 'Stop Camera'}
              >
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>

              <button 
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className="pulse-btn"
                style={{ 
                  background: isScreenSharing ? '#0284C7' : '#334155', 
                  color: '#FFFFFF', 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  padding: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
                title={isScreenSharing ? 'Stop Sharing' : 'Share Screen / Medical Records'}
              >
                <Share2 size={20} />
              </button>

              <button 
                onClick={onClose}
                className="pulse-btn"
                style={{ 
                  background: '#EF4444', 
                  color: '#FFFFFF', 
                  padding: '10px 24px', 
                  borderRadius: '30px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                }}
              >
                <PhoneOff size={18} />
                <span>Leave Consultation</span>
              </button>
            </div>
          </div>

          {/* Side Chat & Clinical Notes Drawer */}
          {showChat && (
            <div style={{ 
              width: '340px', 
              background: '#1E293B', 
              borderLeft: '1px solid #334155', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <div style={{ 
                padding: '16px', 
                borderBottom: '1px solid #334155', 
                fontWeight: 700, 
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <MessageSquare size={16} color="#38BDF8" />
                <span>Consultation In-Call Chat</span>
              </div>

              {/* Messages list */}
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '16px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}>
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    style={{ 
                      alignSelf: (msg.isDoctor && userRole === 'DOCTOR') || (!msg.isDoctor && userRole !== 'DOCTOR') 
                        ? 'flex-end' 
                        : 'flex-start',
                      maxWidth: '85%',
                      background: (msg.isDoctor && userRole === 'DOCTOR') || (!msg.isDoctor && userRole !== 'DOCTOR')
                        ? '#2563EB'
                        : '#334155',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      color: '#F8FAFC'
                    }}
                  >
                    <div style={{ 
                      fontSize: '0.7rem', 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      marginBottom: '3px',
                      fontWeight: 600
                    }}>
                      {msg.sender} • {msg.time}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                ))}
              </div>

              {/* Input box */}
              <form 
                onSubmit={handleSendMessage}
                style={{ 
                  padding: '12px 16px', 
                  borderTop: '1px solid #334155', 
                  display: 'flex', 
                  gap: '8px' 
                }}
              >
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  placeholder="Type a clinical question or message..." 
                  style={{ 
                    flex: 1, 
                    background: '#0F172A', 
                    border: '1px solid #475569', 
                    borderRadius: '8px', 
                    color: '#FFF', 
                    padding: '8px 12px',
                    fontSize: '0.85rem'
                  }}
                />
                <button 
                  type="submit" 
                  className="pulse-btn pulse-btn-primary" 
                  style={{ padding: '8px 14px' }}
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
