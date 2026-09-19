import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, X, Send, Sparkles, AlertTriangle, ShieldCheck, 
  HelpCircle, Stethoscope, Clock, ChevronDown, RefreshCw,
  MessageSquare, User, Activity, CheckCircle2, ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
  isEmergency?: boolean;
}

export const HealthChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialWelcomeMessages: ChatMessage[] = [
    {
      id: 'init-1',
      sender: 'bot',
      text: "👋 Hello! I am **PulseBot**, your 24/7 AI Health & Clinical Triage Assistant. How can I help you today?",
      timestamp: 'Just now',
      suggestedActions: [
        { label: '🩺 Check My Symptoms', action: 'symptoms' },
        { label: '👨‍⚕️ Find a Specialist', action: 'specialist' },
        { label: '🧪 Lab Test Fasting Rules', action: 'fasting' },
        { label: '📹 Telehealth Video Help', action: 'telehealth' }
      ]
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('pulsepoint_ai_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return initialWelcomeMessages;
  });

  useEffect(() => {
    localStorage.setItem('pulsepoint_ai_chat', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  const handleReset = () => {
    setMessages(initialWelcomeMessages);
  };

  const generateBotResponse = (userQuery: string): ChatMessage => {
    const q = userQuery.toLowerCase();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Emergency check
    if (q.includes('chest pain') || q.includes('heart attack') || q.includes('stroke') || q.includes('difficulty breathing') || q.includes('can\'t breathe') || q.includes('unconscious') || q.includes('heavy bleeding')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "🚨 **CRITICAL MEDICAL ALERT**: Your symptoms may indicate an acute life-threatening emergency. \n\n**Please call 911 / 112 or proceed immediately to the nearest Emergency Room.** Do not wait for an online appointment.",
        timestamp: timeNow,
        isEmergency: true,
        suggestedActions: [
          { label: '🚨 View Emergency SOS Protocol', action: 'emergency_sos' }
        ]
      };
    }

    // Symptom triage: Headache / Migraine
    if (q.includes('headache') || q.includes('migraine') || q.includes('head pain')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "🧠 **Headache Assessment:**\n- **Tension/Dehydration**: Rest in a dark room, hydrate with electrolyte fluids, and avoid screen glare.\n- **Migraine**: Note if you experience aura, light sensitivity, or nausea.\n- **Red Flags**: Sudden severe 'thunderclap' headache, stiff neck, or fever requires emergency evaluation.\n\nRecommended specialist: **Neurologist** (Dr. Marcus Vance, MD).",
        timestamp: timeNow,
        suggestedActions: [
          { label: 'Book Dr. Marcus Vance (Neurology)', action: 'find_neurology' },
          { label: 'Ask About Medications', action: 'med_info' }
        ]
      };
    }

    // Symptom triage: Fever / Cold / Cough / Flu
    if (q.includes('fever') || q.includes('cough') || q.includes('cold') || q.includes('flu') || q.includes('sore throat')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "🌡️ **Respiratory & Fever Guidance:**\n- Measure temperature every 4 hours.\n- Maintain high hydration and consider saline gargles for sore throat.\n- If fever exceeds 103°F (39.4°C) or lasts >3 consecutive days with shortness of breath, consult a physician promptly.\n\nRecommended: **Pulmonologist / Pediatrician** (Dr. Arthur Pendelton / Dr. Ananya Sharma).",
        timestamp: timeNow,
        suggestedActions: [
          { label: 'Consult Dr. Arthur Pendelton', action: 'find_pulm' },
          { label: 'Start Telehealth Exam', action: 'telehealth' }
        ]
      };
    }

    // Skin issues
    if (q.includes('skin') || q.includes('rash') || q.includes('acne') || q.includes('itching') || q.includes('mole')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "🧴 **Dermatological Health:**\n- Avoid scratching or applying harsh steroid creams without diagnosis.\n- You can upload high-resolution photos during your Telehealth consultation or direct message our dermatologist.\n\nRecommended specialist: **Dermatologist** (Dr. Elena Rostova, MD).",
        timestamp: timeNow,
        suggestedActions: [
          { label: 'Message Dr. Elena Rostova', action: 'find_derma' }
        ]
      };
    }

    // Joint / Bone / Back Pain
    if (q.includes('bone') || q.includes('joint') || q.includes('back pain') || q.includes('knee') || q.includes('fracture') || q.includes('ortho')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "🦴 **Orthopedic & Spine Care:**\n- Use R.I.C.E. protocol (Rest, Ice, Compression, Elevation) for acute joint sprains.\n- For chronic lower back or knee discomfort, our orthopedists can review imaging (X-Ray/MRI) and provide targeted physical therapy regimens.\n\nRecommended specialist: **Orthopedics** (Dr. David Chen, MD).",
        timestamp: timeNow,
        suggestedActions: [
          { label: 'Book Dr. David Chen (Orthopedics)', action: 'find_ortho' }
        ]
      };
    }

    // Heart / Cardiology / BP
    if (q.includes('heart') || q.includes('cardio') || q.includes('blood pressure') || q.includes('palpitations') || q.includes('cholesterol')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "❤️ **Cardiovascular Wellness:**\n- Monitor resting heart rate and blood pressure twice daily.\n- High blood pressure (Hypertension) and lipid management require routine ECG and lipid panel screening.\n\nRecommended specialist: **Cardiologist** (Dr. Sarah Jenkins, MD).",
        timestamp: timeNow,
        suggestedActions: [
          { label: 'Consult Dr. Sarah Jenkins (Cardiology)', action: 'find_cardio' }
        ]
      };
    }

    // Fasting / Lab tests
    if (q.includes('fast') || q.includes('fasting') || q.includes('blood test') || q.includes('lipid') || q.includes('glucose')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "🧪 **Fasting Guidelines for Lab Work:**\n- **Comprehensive Metabolic & Lipid Panel**: 10-12 hours fasting (plain water is allowed and encouraged).\n- **Fasting Blood Sugar (HbA1c / Glucose)**: Minimum 8 hours.\n- **Medications**: Take routine prescribed medications with sips of water unless instructed otherwise by your doctor.",
        timestamp: timeNow,
        suggestedActions: [
          { label: 'Check Vitals Tracker', action: 'vitals' },
          { label: 'Consult Doctor', action: 'specialist' }
        ]
      };
    }

    // Telehealth
    if (q.includes('telehealth') || q.includes('video') || q.includes('virtual') || q.includes('call')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "📹 **Telehealth Video Consultations:**\n- Encrypted HD WebRTC audio/video exam rooms.\n- Digital clinical prescription generation during the call.\n- Accessible from mobile, tablet, or desktop without software download.\n\nYou can enter the virtual exam room directly from the top navigation bar or doctor card!",
        timestamp: timeNow,
        suggestedActions: [
          { label: 'Launch Telehealth Room', action: 'telehealth' }
        ]
      };
    }

    // Default friendly response
    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: "Thank you for reaching out! I can assist you with:\n\n1. **Symptom Triage**: Explain your symptoms (e.g. fever, headache, back pain, rash).\n2. **Specialist Recommendation**: Match you to one of our 18+ board-certified physicians.\n3. **Direct Doctor Messaging**: You can click **'Message Doctor'** on any doctor profile to start a direct clinical inquiry.\n4. **Telehealth & Vitals**: Access virtual exam rooms and digital prescription vaults.",
      timestamp: timeNow,
      suggestedActions: [
        { label: '🩺 Triage Symptoms', action: 'symptoms' },
        { label: '👨‍⚕️ Explore Doctors', action: 'specialist' }
      ]
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: timeNow
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply = generateBotResponse(query);
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 900);
  };

  const handleActionClick = (action: string) => {
    if (action === 'symptoms') {
      handleSendMessage("I want to check my symptoms and get triage guidance.");
    } else if (action === 'specialist') {
      handleSendMessage("Which medical specialists are available on PulsePoint?");
    } else if (action === 'fasting') {
      handleSendMessage("What are the fasting rules before a blood test?");
    } else if (action === 'telehealth') {
      handleSendMessage("How does the Telehealth video consultation work?");
    } else if (action === 'emergency_sos') {
      handleSendMessage("What should I do in a medical emergency?");
    } else if (action === 'find_cardio') {
      handleSendMessage("Tell me about your cardiology specialists.");
    } else if (action === 'find_derma') {
      handleSendMessage("I need help with a dermatology problem.");
    } else if (action === 'find_neurology') {
      handleSendMessage("Can you recommend a neurologist for headaches?");
    } else if (action === 'find_physician') {
      handleSendMessage("I want to book an internal medicine general physician.");
    } else if (action === 'find_ortho') {
      handleSendMessage("I have joint and bone pain.");
    } else {
      handleSendMessage(action);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9998 }}>
          <button
            onClick={handleOpen}
            aria-label="Open AI Health Assistant"
            style={{
              width: '62px',
              height: '62px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)',
              border: '3px solid #FFFFFF',
              boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.5), 0 8px 10px -6px rgba(2, 132, 199, 0.5)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Bot size={30} />
            
            {hasUnread && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#EF4444',
                color: '#FFF',
                fontSize: '10px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFF'
              }}>
                1
              </span>
            )}

            {/* Micro Live Glow */}
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10B981',
              border: '2px solid #FFFFFF'
            }} />
          </button>
        </div>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '400px',
            maxWidth: 'calc(100vw - 32px)',
            height: '620px',
            maxHeight: 'calc(100vh - 48px)',
            borderRadius: '24px',
            background: '#FFFFFF',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9999,
            animation: 'slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            padding: '16px 20px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284C7, #0D9488)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                position: 'relative'
              }}>
                <Bot size={22} />
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '2px solid #0F172A'
                }} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>PulseBot AI</span>
                  <span style={{
                    fontSize: '0.65rem',
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#38BDF8',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    CLINICAL v2.5
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={11} color="#34D399" />
                  <span>24/7 AI Triage & Symptom Checker</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleReset}
                title="Restart conversation"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '30px',
                  height: '30px',
                  color: '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize assistant"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '30px',
                  height: '30px',
                  color: '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div style={{
            background: '#F0FDF4',
            borderBottom: '1px solid #DCFCE7',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.72rem',
            color: '#166534'
          }}>
            <Sparkles size={13} color="#15803D" />
            <span>Simulated AI health assistant for guidance & specialist referral.</span>
          </div>

          {/* Chat Messages Body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            background: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  fontSize: '0.68rem',
                  color: '#94A3B8',
                  marginBottom: '2px',
                  fontWeight: 600
                }}>
                  {msg.sender === 'user' ? 'You' : 'PulseBot AI'} • {msg.timestamp}
                </div>

                <div
                  style={{
                    background: msg.isEmergency
                      ? '#FEF2F2'
                      : msg.sender === 'user'
                      ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)'
                      : '#FFFFFF',
                    color: msg.isEmergency ? '#991B1B' : msg.sender === 'user' ? '#FFFFFF' : '#1E293B',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    fontSize: '0.85rem',
                    lineHeight: '1.45',
                    border: msg.isEmergency ? '1.5px solid #FCA5A5' : msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '8px'
                  }}>
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act.action)}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #0284C7',
                          color: '#0284C7',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#0284C7';
                          e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FFFFFF';
                          e.currentTarget.style.color = '#0284C7';
                        }}
                      >
                        <span>{act.label}</span>
                        <ArrowRight size={10} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                fontSize: '0.75rem',
                color: '#64748B'
              }}>
                <div className="live-indicator" style={{ width: '6px', height: '6px' }} />
                <span>PulseBot is analyzing symptoms...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div style={{
            padding: '6px 12px',
            background: '#F1F5F9',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto'
          }}>
            {['Fever & chills', 'Chest discomfort', 'Skin rash', 'Blood test fast'].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '3px 8px',
                  fontSize: '0.7rem',
                  color: '#475569',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '10px 14px',
              background: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask symptom, medication, or doctor..."
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.82rem',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />

            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                background: input.trim() ? '#0284C7' : '#94A3B8',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
                transition: 'background 0.2s ease'
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
