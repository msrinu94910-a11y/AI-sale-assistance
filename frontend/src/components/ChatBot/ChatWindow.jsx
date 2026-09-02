import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Zap, Calendar, Award } from 'lucide-react';
import { apiService } from '../../services/api';

export function ChatWindow({ onLeadAdded }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am your AI Sales Assistant powered by FastAPI and GPT intelligence. I can help you qualify leads using BANT scoring, answer pricing inquiries, or schedule live product demos.",
      intent: 'inquiry',
      suggested_actions: ["Calculate BANT Score", "Explore Pricing Plans", "Schedule Demo"],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend = inputMessage) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await apiService.sendChatMessage(textToSend);
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: response.response,
        intent: response.intent,
        score_change: response.score_change,
        suggested_actions: response.suggested_actions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "What are your Enterprise CRM pricing plans?",
    "How does the AI lead qualification scoring work?",
    "Schedule a live product demo for 50 sales reps",
    "Qualify a new lead: Sarah at Cyberdyne (Budget $100k, Timeline Q4)"
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', height: 'calc(100vh - 120px)' }}>
      
      {/* Main Chat Conversation Container */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Chat Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)' }}>
              <Bot size={22} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                AI Sales Conversation Workspace
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Automated Lead Nurturing & Qualification</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-success">
              <span className="pulse-dot"></span> Active Engine
            </span>
          </div>
        </div>

        {/* Message Feed */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px', background: '#f8fafc' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: '12px'
              }}
            >
              {msg.sender === 'assistant' && (
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}>
                  <Bot size={20} color="#fff" />
                </div>
              )}

              <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {msg.intent && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      background: '#dbeafe',
                      color: '#1e40af',
                      textTransform: 'uppercase'
                    }}>
                      Intent: {msg.intent}
                    </span>
                    {msg.score_change > 0 && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--status-success)', fontWeight: '700' }}>
                        +{msg.score_change} Lead Score Pts
                      </span>
                    )}
                  </div>
                )}

                <div style={{
                  padding: '14px 18px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  boxShadow: msg.sender === 'user' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 2px 8px rgba(15, 23, 42, 0.05)',
                  fontSize: '0.92rem',
                  lineHeight: '1.5'
                }}>
                  {msg.text}
                </div>

                {/* Suggested Action Pills */}
                {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {msg.suggested_actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(act)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#2563eb',
                          padding: '5px 12px',
                          borderRadius: '14px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          transition: 'all 0.2s'
                        }}
                      >
                        ⚡ {act}
                      </button>
                    ))}
                  </div>
                )}

                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={20} color="#0f172a" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#fff" />
              </div>
              <div style={{ padding: '12px 18px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                AI is calculating intent & BANT qualification parameters...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', background: '#ffffff' }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask AI Sales Assistant to qualify a lead, calculate pricing, or schedule a demo..."
              style={{
                flex: 1,
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '12px 16px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !inputMessage.trim()}>
              <Send size={18} />
              <span>Send</span>
            </button>
          </form>
        </div>

      </div>

      {/* Right Sidebar: Quick Prompts & AI Capabilities */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Quick Prompts Panel */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Zap size={18} color="var(--accent-primary)" />
            <h4 style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>Recommended Prompts</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                💬 {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* AI Capabilities Card */}
        <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)', border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Award size={18} color="var(--accent-primary)" />
            <h4 style={{ fontSize: '0.98rem', color: '#1e3a8a' }}>BANT Evaluation Matrix</h4>
          </div>

          <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: '#1e40af', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li style={{ display: 'flex', justify: 'space-between' }}>
              <span>💰 Budget Weight</span>
              <strong style={{ color: '#1e3a8a' }}>25%</strong>
            </li>
            <li style={{ display: 'flex', justify: 'space-between' }}>
              <span>🎯 Business Need</span>
              <strong style={{ color: '#1e3a8a' }}>30%</strong>
            </li>
            <li style={{ display: 'flex', justify: 'space-between' }}>
              <span>👑 Authority Level</span>
              <strong style={{ color: '#1e3a8a' }}>20%</strong>
            </li>
            <li style={{ display: 'flex', justify: 'space-between' }}>
              <span>⏱️ Timeline Urgency</span>
              <strong style={{ color: '#1e3a8a' }}>25%</strong>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
