import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  User, 
  RefreshCw, 
  Code, 
  Zap,
  Tag,
  Building,
  Mail,
  DollarSign
} from 'lucide-react';
import { apiService } from '../../services/api';

export function BotPlayground({ onLeadOrMeetingUpdated }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(`session_${Math.random().toString(36).substring(2, 10)}`);
  const [botStatus, setBotStatus] = useState(null);
  const [lastRawResponse, setLastRawResponse] = useState(null);
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [extractedSummary, setExtractedSummary] = useState({});

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadStatus();
    // Initial welcome turn
    setMessages([
      {
        id: 1,
        sender: 'assistant',
        text: "Hello! I am your Sales Assistant Bot API. I can qualify inbound prospects, extract entities (name, email, budget), calculate BANT scores, and schedule product demos. What would you like to explore?",
        intent: "greeting",
        suggested_actions: ["Explain BANT Scoring", "View Pricing Plans", "Schedule Demo", "Qualify Inbound Lead"],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadStatus = async () => {
    try {
      const data = await apiService.getBotStatus();
      setBotStatus(data);
    } catch (e) {
      console.warn('Bot status offline', e);
    }
  };

  const handleSend = async (textToSend = inputMessage) => {
    if (!textToSend.trim() || loading) return;

    const userText = textToSend.trim();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const data = await apiService.sendBotChat(userText, sessionId);
      setLastRawResponse(data);
      if (data.session_id) {
        setSessionId(data.session_id);
      }

      // Update extracted entities summary
      if (data.extracted_entities) {
        setExtractedSummary((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(data.extracted_entities).filter(([_, v]) => v != null)
          )
        }));
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: data.reply,
        intent: data.intent,
        suggested_actions: data.suggested_actions || [],
        extracted: data.extracted_entities,
        lead: data.lead,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);

      // If lead or meeting was created/updated, notify parent app
      if (data.lead || data.intent === 'demo_booked') {
        if (onLeadOrMeetingUpdated) onLeadOrMeetingUpdated();
      }
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: `⚠️ API Error: ${err.message || 'Unable to connect to /api/v1/bot/chat'}`,
        intent: 'error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSession = () => {
    const newId = `session_${Math.random().toString(36).substring(2, 10)}`;
    setSessionId(newId);
    setExtractedSummary({});
    setMessages([
      {
        id: Date.now(),
        sender: 'assistant',
        text: "Session reset. Started a new clean multi-turn conversation context.",
        intent: "system",
        suggested_actions: ["Explain BANT Scoring", "View Pricing Plans", "Schedule Demo"],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header Card */}
      <div className="glass-panel" style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, #0c192c 0%, #152a4a 100%)',
        color: '#ffffff',
        border: '1px solid rgba(0, 114, 255, 0.3)',
        boxShadow: '0 10px 30px rgba(12, 25, 44, 0.4)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={13} /> REST API: /api/v1/bot/chat
              </span>
              <span style={{ fontSize: '0.78rem', color: '#9fb3c8' }}>
                Session: <code style={{ color: '#38bdf8' }}>{sessionId}</code>
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '4px' }}>
              Sales Assistant Bot API Console
            </h1>
            <p style={{ color: '#bcccdc', fontSize: '0.88rem' }}>
              Test multi-turn sales dialogue, automated BANT qualification, entity extraction, and live calendar booking.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              className="btn btn-secondary" 
              onClick={handleResetSession}
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.82rem', padding: '8px 14px' }}
            >
              <RefreshCw size={14} /> Reset Session
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowJsonInspector(!showJsonInspector)}
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              <Code size={14} /> {showJsonInspector ? 'Hide JSON' : 'Inspect JSON'}
            </button>
            <a 
              href="http://localhost:8000/docs" 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-gold"
              style={{ fontSize: '0.82rem', padding: '8px 14px', textDecoration: 'none' }}
            >
              Swagger Docs ↗
            </a>
          </div>
        </div>

        {/* Providers pill row */}
        {botStatus && (
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#9fb3c8', fontWeight: '700' }}>Active Providers:</span>
            {botStatus.active_providers?.map((p, i) => (
              <span key={i} style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                ✓ {p}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: showJsonInspector ? '1fr 1fr' : '2fr 1fr', gap: '20px' }}>
        
        {/* Left: Chat Window */}
        <div className="glass-panel" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '620px', 
          background: '#ffffff',
          overflow: 'hidden' 
        }}>
          
          {/* Chat Messages Log */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', maxWidth: '82%', flexDirection: isUser ? 'row-reverse' : 'row' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isUser ? '#0072ff' : '#0c192c',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {isUser ? <User size={16} /> : <Bot size={16} color="#00c6ff" />}
                    </div>

                    <div>
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                        background: isUser ? 'linear-gradient(135deg, #0072ff 0%, #0052cc 100%)' : '#f1f5f9',
                        color: isUser ? '#ffffff' : '#0c192c',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap',
                        boxShadow: isUser ? '0 4px 12px rgba(0, 114, 255, 0.2)' : 'none',
                        border: isUser ? 'none' : '1px solid #e2e8f0'
                      }}>
                        {m.text}
                      </div>

                      {/* Bot Response Metadata Chips */}
                      {!isUser && (m.intent || m.lead) && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                          {m.intent && (
                            <span style={{ fontSize: '0.68rem', color: '#0072ff', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                              Intent: {m.intent}
                            </span>
                          )}
                          {m.lead && (
                            <span style={{ fontSize: '0.68rem', color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                              Auto-Synced Lead: {m.lead.name} ({m.lead.category || 'Warm'})
                            </span>
                          )}
                        </div>
                      )}

                      {/* Suggested Action Pills */}
                      {!isUser && m.suggested_actions?.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                          {m.suggested_actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(act)}
                              style={{
                                background: '#ffffff',
                                color: '#0072ff',
                                border: '1px solid #bfdbfe',
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                              }}
                            >
                              + {act}
                            </button>
                          ))}
                        </div>
                      )}

                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: isUser ? 'right' : 'left' }}>
                        {m.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0c192c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={14} color="#00c6ff" />
                </div>
                <span>SalesBot is thinking & processing API turn...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div style={{ padding: '16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
              style={{ display: 'flex', gap: '10px' }}
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message (e.g. 'I am Alex from Acme, email alex@acme.com, budget $50k')..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: '#ffffff'
                }}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="btn btn-primary"
                style={{ borderRadius: '10px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={16} /> Send
              </button>
            </form>
          </div>
        </div>

        {/* Right: Real-time Entity Inspector or JSON Raw Inspector */}
        {showJsonInspector ? (
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '620px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code size={16} color="#0072ff" /> Raw API Response Payload
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>POST /api/v1/bot/chat</span>
            </div>
            <pre style={{
              flex: 1,
              background: '#070f1e',
              color: '#38bdf8',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              overflow: 'auto',
              fontFamily: 'Consolas, monospace',
              lineHeight: '1.4'
            }}>
              {lastRawResponse ? JSON.stringify(lastRawResponse, null, 2) : '// Send a message to inspect the live JSON response payload'}
            </pre>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Extracted Entities Card */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={16} color="#0072ff" /> Extracted Entities (Session)
              </h3>

              {Object.keys(extractedSummary).length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  No entities captured yet. Mention your name, email, company, or budget in chat!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {extractedSummary.name && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Name:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{extractedSummary.name}</strong>
                    </div>
                  )}
                  {extractedSummary.email && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                      <strong style={{ color: '#0072ff' }}>{extractedSummary.email}</strong>
                    </div>
                  )}
                  {extractedSummary.company && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Company:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{extractedSummary.company}</strong>
                    </div>
                  )}
                  {extractedSummary.phone && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{extractedSummary.phone}</strong>
                    </div>
                  )}
                  {extractedSummary.budget && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Budget:</span>
                      <strong style={{ color: '#16a34a' }}>{extractedSummary.budget}</strong>
                    </div>
                  )}
                  {extractedSummary.timeline && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Timeline:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{extractedSummary.timeline}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Test Scenarios */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                🚀 Quick Test Scenarios
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ textAlign: 'left', fontSize: '0.78rem', padding: '8px 12px' }}
                  onClick={() => handleSend("I am Marcus Vance from Apex Dynamics, email marcus@apexdynamics.com, budget $80k")}
                >
                  📝 1. Capture Prospect Profile
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ textAlign: 'left', fontSize: '0.78rem', padding: '8px 12px' }}
                  onClick={() => handleSend("Explain how the BANT scoring weights work")}
                >
                  🎯 2. Inquire BANT Algorithm
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ textAlign: 'left', fontSize: '0.78rem', padding: '8px 12px' }}
                  onClick={() => handleSend("What are the pricing plans for SalesBot AI?")}
                >
                  💰 3. Request Pricing Breakdown
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ textAlign: 'left', fontSize: '0.78rem', padding: '8px 12px' }}
                  onClick={() => handleSend("Please book the afternoon slot for our live product demo")}
                >
                  📅 4. Book Afternoon Demo Slot
                </button>
              </div>
            </div>

            {/* API Endpoints Reference */}
            <div className="glass-panel" style={{ padding: '16px', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                📡 Registered Endpoints:
              </div>
              <ul style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: '1.6' }}>
                <li><code>POST /api/v1/bot/chat</code></li>
                <li><code>GET /api/v1/bot/sessions/{'{id}'}/history</code></li>
                <li><code>POST /api/v1/bot/qualify</code></li>
                <li><code>POST /api/v1/bot/book</code></li>
                <li><code>GET /api/v1/bot/status</code></li>
              </ul>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
