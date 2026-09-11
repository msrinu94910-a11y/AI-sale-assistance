import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Calendar, Bot, RefreshCw, ChevronDown, CheckCircle2 } from 'lucide-react';
import { apiService } from '../../services/api';

export function FloatingChatWidget({ onLeadOrMeetingUpdated, onOpenEmbedModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Visitor Session ID Management
  const [sessionId, setSessionId] = useState(() => {
    let saved = localStorage.getItem('salesbot_visitor_session_id');
    if (!saved) {
      saved = 'visitor_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem('salesbot_visitor_session_id', saved);
    }
    return saved;
  });

  // Conversation Log Persistence
  const [messages, setMessages] = useState(() => {
    const savedKey = `salesbot_chat_history_${sessionId}`;
    const saved = localStorage.getItem(savedKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback initial state
      }
    }
    return [
      {
        id: 1,
        sender: 'bot',
        message: '👋 Welcome! I am your **Property Sales AI Assistant**.\n\nI can help you find available properties, explain details, or schedule a live site visit for you.',
        suggested_actions: ['Find a Property', 'Properties under my budget', 'Compare Properties', 'Book a Site Visit'],
        timestamp: new Date().toISOString()
      }
    ];
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedKey = `salesbot_chat_history_${sessionId}`;
    localStorage.setItem(savedKey, JSON.stringify(messages));
  }, [messages, sessionId]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleWidget = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setShowWelcomeBanner(false);
    }
  };

  const handleResetSession = () => {
    if (window.confirm('Reset this visitor chat session and clear conversation history?')) {
      const newSession = 'visitor_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem('salesbot_visitor_session_id', newSession);
      setSessionId(newSession);
      const initial = [
        {
          id: Date.now(),
          sender: 'bot',
          message: '👋 Hello! I am your AI Property Sales Assistant. How can I help you find your dream property today?',
          suggested_actions: ['Find a Property', 'Properties under my budget', 'Book a Site Visit'],
          timestamp: new Date().toISOString()
        }
      ];
      setMessages(initial);
      localStorage.setItem(`salesbot_chat_history_${newSession}`, JSON.stringify(initial));
    }
  };

  const handleSendMessage = async (textToSend = null) => {
    const rawText = typeof textToSend === 'string' ? textToSend : inputMessage;
    if (!rawText || !rawText.trim() || isLoading) return;
    const text = rawText.trim();

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      message: text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await apiService.sendBotChat(text.trim(), sessionId);
      
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        message: botResponse.reply || 'Thank you for your inquiry. Our sales engineering team will assist you shortly.',
        intent: botResponse.intent,
        score_change: botResponse.score_change,
        suggested_actions: botResponse.suggested_actions || [],
        timestamp: botResponse.timestamp || new Date().toISOString()
      };

      setMessages((prev) => [...prev, botMsg]);

      // If action generated a lead or scheduled a meeting, refresh app metrics
      if (['demo_booked', 'lead_qualified'].includes(botResponse.intent) && onLeadOrMeetingUpdated) {
        onLeadOrMeetingUpdated();
      }
    } catch (err) {
      console.error('Error in floating widget chat turn:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          message: 'I received your message! Would you like me to book a site visit or answer property details?',
          suggested_actions: ['Find a Property', 'Book a Site Visit'],
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9990, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      
      {/* Expanded Floating Chat Window */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '580px',
            maxHeight: 'calc(100vh - 100px)',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(10, 25, 47, 0.25)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            marginBottom: '16px'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0c192c 0%, #1a2b4c 100%)',
              color: '#ffffff',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0072ff, #ff9f00)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 0 12px rgba(0,114,255,0.4)'
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: '700', lineHeight: 1.2 }}>
                  SalesBot AI Assistant
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  <span>Online • Visitor Session Active</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                className="btn btn-secondary btn-icon"
                style={{ padding: '6px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none' }}
                onClick={handleResetSession}
                title="Reset Chat History"
              >
                <RefreshCw size={14} />
              </button>

              <button
                className="btn btn-secondary btn-icon"
                style={{ padding: '6px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none' }}
                onClick={handleToggleWidget}
                title="Minimize Chat"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Quick Action Bar Header Banner */}
          <div
            style={{
              background: '#eef4fc',
              padding: '8px 14px',
              borderBottom: '1px solid #bcccdc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}
          >
            <span>✨ 24/7 Property Recommendations & Site Visits</span>
            <button
              style={{ background: 'none', border: 'none', color: '#0072ff', fontWeight: '700', cursor: 'pointer', fontSize: '0.73rem' }}
              onClick={() => handleSendMessage('Book a Site Visit')}
            >
              Book Site Visit →
            </button>
          </div>

          {/* Chat Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div
                  style={{
                    padding: '11px 15px',
                    borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: m.sender === 'user' ? 'linear-gradient(135deg, #0072ff, #005bb5)' : '#ffffff',
                    color: m.sender === 'user' ? '#ffffff' : '#0c192c',
                    fontSize: '0.85rem',
                    lineHeight: '1.45',
                    border: m.sender === 'user' ? 'none' : '1px solid #e1e8f0',
                    boxShadow: '0 2px 8px rgba(10, 25, 47, 0.04)',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {m.message}

                  {/* Intent & Score Badge if present */}
                  {m.intent && m.intent === 'demo_booked' && (
                    <div style={{ marginTop: '8px', padding: '6px 10px', background: '#d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} /> Site Visit Confirmed & Saved
                    </div>
                  )}
                </div>

                {/* Action Chips */}
                {m.suggested_actions && m.suggested_actions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {m.suggested_actions.map((action, idx) => (
                      <button
                        key={idx}
                        className="btn btn-secondary"
                        onClick={() => handleSendMessage(action)}
                        style={{
                          padding: '5px 11px',
                          fontSize: '0.75rem',
                          borderRadius: '16px',
                          background: '#ffffff',
                          color: '#0072ff',
                          border: '1px solid #bcccdc',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: '#ffffff', padding: '10px 14px', borderRadius: '14px', border: '1px solid #e1e8f0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                🤖 AI Assistant is writing...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Footer Input Controls */}
          <div style={{ padding: '12px 16px', background: '#ffffff', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask about properties, locations, or budgets..."
              style={{
                flex: 1,
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                padding: '10px 16px',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            <button
              className="btn btn-gold btn-icon"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                padding: 0,
                flexShrink: 0
              }}
            >
              <Send size={16} />
            </button>
          </div>

          <div style={{ textAlign: 'center', background: '#f8fafc', padding: '4px 0 6px 0', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            ⚡ Powered by <strong>SalesBot AI</strong> • Visitor Session ID: <code style={{ fontSize: '0.65rem' }}>{sessionId.substring(0, 16)}...</code>
          </div>

        </div>
      )}

      {/* Floating Action Button Trigger */}
      <button
        onClick={handleToggleWidget}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0072ff 0%, #ff9f00 100%)',
          color: '#ffffff',
          border: '2px solid #ffffff',
          boxShadow: '0 8px 30px rgba(0, 114, 255, 0.35)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative'
        }}
        title="Open AI Sales Assistant"
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}

        {/* Pulse Indicator Badge */}
        {!isOpen && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              background: '#10b981',
              border: '2px solid #ffffff',
              borderRadius: '50%'
            }}
          />
        )}
      </button>

    </div>
  );
}

export default FloatingChatWidget;
