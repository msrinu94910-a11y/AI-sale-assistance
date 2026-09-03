import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Zap, Calendar, Award, Key, X, Check } from 'lucide-react';
import { apiService } from '../../services/api';

export function ChatWindow({ onLeadAdded }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am your AI Sales Assistant. I dynamically answer any custom prompt — whether you want to qualify a lead, draft an outreach email, compare CRM pricing plans, or schedule a live product demo.",
      intent: 'greeting',
      suggested_actions: ["Explain How This Works", "Draft Outreach Email", "View Pricing Plans", "Schedule Demo"],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(localStorage.getItem('SALESBOT_OPENAI_API_KEY') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      localStorage.setItem('SALESBOT_OPENAI_API_KEY', apiKeyInput.trim());
    } else {
      localStorage.removeItem('SALESBOT_OPENAI_API_KEY');
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowSettings(false);
    }, 1200);
  };

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
      const response = await apiService.sendChatMessage(textToSend, {
        openaiApiKey: localStorage.getItem('SALESBOT_OPENAI_API_KEY') || ''
      });

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
    "How does this work?",
    "Write an outreach email to Sarah Connor",
    "Who is Sarah Connor and what is her lead score?",
    "What are your Enterprise CRM pricing plans?"
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', height: 'calc(100vh - 120px)' }}>
      
      {/* Main Chat Conversation Container */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Simplified Clean Chat Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0, 114, 255, 0.35)' }}>
              <Bot size={22} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                AI Sales Conversation Workspace
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dynamic AI Nurturing & BANT Qualification</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#eef4fc',
                border: '1px solid #bcccdc',
                fontSize: '0.78rem',
                color: '#0072ff',
                fontWeight: '700',
                cursor: 'pointer'
              }}
              title="Configure LLM API Key (Optional)"
            >
              <Key size={14} />
              <span>{localStorage.getItem('SALESBOT_OPENAI_API_KEY') ? 'API Key Active' : 'LLM Settings'}</span>
            </button>
          </div>
        </div>

        {/* API Key Modal Drawer / Settings Box */}
        {showSettings && (
          <div style={{ padding: '16px 24px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e3a8a' }}>
                🔑 Configure Custom OpenAI / LLM API Key (Optional)
              </div>
              <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e40af' }}>
                <X size={16} />
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#1e40af' }}>
              SalesBot AI works out-of-the-box with built-in dynamic generative AI. You can optionally paste an OpenAI API key below to stream responses directly from GPT-4 / GPT-3.5:
            </p>
            <form onSubmit={handleSaveApiKey} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #93c5fd', fontSize: '0.85rem', outline: 'none' }}
              />
              <button type="submit" className="btn btn-gold" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                {savedSuccess ? <><Check size={14} /> Saved!</> : 'Save Key'}
              </button>
            </form>
          </div>
        )}

        {/* Message Feed */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px', background: '#f8fafc' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justify: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: '12px'
              }}
            >
              {msg.sender === 'assistant' && (
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0, 114, 255, 0.3)' }}>
                  <Bot size={20} color="#fff" />
                </div>
              )}

              <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {msg.intent && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      background: '#e6f0ff',
                      color: '#0072ff',
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
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  border: msg.sender === 'user' ? 'none' : '1px solid #e1e8f0',
                  boxShadow: msg.sender === 'user' ? '0 4px 14px rgba(0, 114, 255, 0.3)' : '0 2px 8px rgba(10, 25, 47, 0.05)',
                  fontSize: '0.92rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
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
                          border: '1px solid #bcccdc',
                          color: '#0072ff',
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
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e1e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={20} color="#0a192f" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#fff" />
              </div>
              <div style={{ padding: '12px 18px', background: '#ffffff', border: '1px solid #e1e8f0', borderRadius: '18px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                SalesBot AI is generating dynamic response...
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
              placeholder="Ask SalesBot AI anything (e.g. 'how this works', 'draft email to Sarah', 'explain pricing')..."
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
            <Zap size={18} color="#0072ff" />
            <h4 style={{ fontSize: '0.98rem', color: 'var(--text-primary)', fontWeight: '800' }}>Recommended Prompts</h4>
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
                  border: '1px solid #e1e8f0',
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
        <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, #e6f0ff 0%, #fff3d6 100%)', border: '1px solid #b8d5ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Award size={18} color="#0072ff" />
            <h4 style={{ fontSize: '0.98rem', color: '#003399', fontWeight: '800' }}>BANT Evaluation Matrix</h4>
          </div>

          <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: '#0044cc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li style={{ display: 'flex', justify: 'space-between' }}>
              <span>💰 Budget Weight</span>
              <strong style={{ color: '#002288' }}>25%</strong>
            </li>
            <li style={{ display: 'flex', justify: 'space-between' }}>
              <span>🎯 Business Need</span>
              <strong style={{ color: '#002288' }}>30%</strong>
            </li>
            <li style={{ display: 'flex', justify: 'space-between' }}>
              <span>👑 Authority Level</span>
              <strong style={{ color: '#002288' }}>20%</strong>
            </li>
            <li style={{ display: 'flex', justify: 'space-between' }}>
              <span>⏱️ Timeline Urgency</span>
              <strong style={{ color: '#002288' }}>25%</strong>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
