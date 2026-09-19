import React, { useState, useEffect, useRef } from 'react';
import { DoctorDTO } from '@pulsepoint/shared';
import { useAuth } from '../../context/AuthContext';
import { 
  X, Send, ShieldCheck, Clock, Stethoscope, Sparkles, 
  Paperclip, CheckCircle2, User, Bot, AlertCircle, Calendar
} from 'lucide-react';

interface DoctorDirectChatModalProps {
  doctor: DoctorDTO;
  onClose: () => void;
  onBookAppointment: (doctor: DoctorDTO) => void;
}

interface DirectMessage {
  id: string;
  senderName: string;
  isDoctor: boolean;
  text: string;
  timestamp: string;
}

export const DoctorDirectChatModal: React.FC<DoctorDirectChatModalProps> = ({
  doctor,
  onClose,
  onBookAppointment
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem(`pulse_chat_${doctor.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: '1',
        senderName: doctor.name,
        isDoctor: true,
        text: `Hello! I am ${doctor.name}, specialist in ${doctor.specialization}. How can I assist you with your health concerns or upcoming consultation today?`,
        timestamp: 'Just now'
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(`pulse_chat_${doctor.id}`, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateDoctorReply = (patientQuery: string) => {
    const query = patientQuery.toLowerCase();
    
    if (query.includes('fee') || query.includes('cost') || query.includes('price')) {
      return `My consultation fee is $${doctor.consultationFee} per 30-minute encounter, which covers our full clinical review, diagnosis, and digital prescription issuance.`;
    }
    if (query.includes('fast') || query.includes('eat') || query.includes('prep') || query.includes('blood test')) {
      return `For metabolic or routine lipid blood panels, an 8 to 12-hour overnight water-only fast is generally advisable. You can bring any past lab reports or medication bottles to our visit.`;
    }
    if (query.includes('book') || query.includes('slot') || query.includes('available') || query.includes('time')) {
      return `I currently have open practicing slots available this week! You can click "Book Appointment" right here to lock in your preferred time.`;
    }
    if (query.includes('pain') || query.includes('symptom') || query.includes('hurt') || query.includes('fever') || query.includes('ache')) {
      return `Thank you for detailing your symptoms. In ${doctor.specialization}, early clinical evaluation helps us pinpoint the root etiology. Please book a slot so we can conduct a full examination and tailor your treatment regimen.`;
    }
    return `Thank you for your message! I have logged your inquiry into our clinical system. Feel free to book an available slot so we can address your symptoms comprehensively in our clinic or via telehealth video.`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg: DirectMessage = {
      id: Date.now().toString(),
      senderName: user?.name || 'Patient',
      isDoctor: false,
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate doctor clinical response after 1.2s
    setTimeout(() => {
      const replyText = generateDoctorReply(userText);
      const docReply: DirectMessage = {
        id: (Date.now() + 1).toString(),
        senderName: doctor.name,
        isDoctor: true,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, docReply]);
      setIsTyping(false);
    }, 1200);
  };

  const quickQuestions = [
    'What should I prepare for our consultation?',
    'Do you offer virtual telehealth video calls?',
    'What is your consultation fee and duration?'
  ];

  return (
    <div className="pulse-modal-overlay">
      <div 
        className="pulse-modal" 
        style={{ 
          maxWidth: '680px', 
          width: '95vw', 
          height: '80vh', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: 0, 
          borderRadius: '20px',
          overflow: 'hidden',
          background: '#FFFFFF',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '18px 24px', 
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
          color: '#FFFFFF' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                width: '46px', 
                height: '46px', 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, #0284C7, #0D9488)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem',
                color: '#FFF'
              }}>
                {doctor.name.replace('Dr. ', '').charAt(0)}
              </div>
              <div style={{ 
                position: 'absolute', 
                bottom: '-2px', 
                right: '-2px', 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                background: '#10B981', 
                border: '2px solid #0F172A' 
              }} />
            </div>

            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{doctor.name}</span>
                <span style={{ fontSize: '0.7rem', color: '#38BDF8', background: 'rgba(56, 189, 248, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                  {doctor.specialization}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={12} color="#34D399" />
                <span>HIPAA Encrypted Patient Portal • Typically replies in &lt;15 min</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => {
                onBookAppointment(doctor);
                onClose();
              }}
              className="pulse-btn pulse-btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700 }}
            >
              <Calendar size={14} /> Book Slot
            </button>
            <button 
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Thread History */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '20px 24px', 
          background: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {messages.map(msg => (
            <div 
              key={msg.id}
              style={{
                alignSelf: msg.isDoctor ? 'flex-start' : 'flex-end',
                maxWidth: '80%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.isDoctor ? 'flex-start' : 'flex-end'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '3px', fontWeight: 600 }}>
                {msg.senderName} • {msg.timestamp}
              </div>

              <div style={{
                background: msg.isDoctor ? '#FFFFFF' : '#0284C7',
                color: msg.isDoctor ? '#0F172A' : '#FFFFFF',
                padding: '12px 16px',
                borderRadius: msg.isDoctor ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                border: msg.isDoctor ? '1px solid #E2E8F0' : 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', padding: '8px 14px', borderRadius: '16px', border: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.8rem' }}>
              <div className="live-indicator" style={{ width: '8px', height: '8px' }} />
              <span>{doctor.name} is typing a response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Prompts */}
        <div style={{ padding: '8px 20px', background: '#F1F5F9', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(q)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '16px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                color: '#334155',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={handleSendMessage}
          style={{ 
            padding: '14px 20px', 
            background: '#FFFFFF', 
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask ${doctor.name} a question about symptoms, medication, or visits...`}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              outline: 'none'
            }}
          />

          <button
            type="submit"
            className="pulse-btn pulse-btn-primary"
            style={{ padding: '12px 18px', borderRadius: '12px' }}
            disabled={!inputText.trim()}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
