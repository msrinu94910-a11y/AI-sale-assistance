import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Phone, Mail, Zap, XCircle } from 'lucide-react';
import { apiService } from '../../services/api';

export function AgentChatModal({ isOpen, onClose, alertData }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const messagesEndRef = useRef(null);
  
  // This WS is purely for reading user responses IF they type during the paused session
  // But wait, the bot_service broadcasts handoff_user_reply to agents! So we can listen to it.
  
  useEffect(() => {
    if (isOpen && alertData) {
      setMessages([
        {
          id: Date.now() - 10,
          sender: 'assistant',
          text: `[SYSTEM] Hot Lead Alert triggered for session ${alertData.session_id.slice(0,8)}...`,
          isSystem: true
        },
        {
          id: Date.now(),
          sender: 'user',
          text: alertData.message
        }
      ]);
      setIsPaused(false);
      // Fetch session history if needed, but for MVP just start from the alert.
    }
  }, [isOpen, alertData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTakeover = async () => {
    try {
      await fetch(`http://localhost:8000/api/v1/bot/sessions/${alertData.session_id}/handoff`, {
        method: 'POST'
      });
      setIsPaused(true);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'assistant',
        text: '[SYSTEM] You have taken over the chat. AI is now paused.',
        isSystem: true
      }]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    if (!isPaused) {
      await handleTakeover();
    }

    const msg = inputMessage;
    setInputMessage('');
    
    setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'assistant',
        text: msg,
        isAgent: true
    }]);

    try {
      await fetch('http://localhost:8000/api/v1/bot/agent_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: alertData.session_id,
          message: msg
        })
      });
    } catch (err) {
      console.error('Failed to send agent message:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '600px',
        background: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        height: '80vh'
      }}>
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #0c192c 0%, #152a4a 100%)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          color: '#ffffff'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#f59e0b" />
              Live Handoff: {alertData?.lead_name}
            </h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#9fb3c8' }}>
              Session: {alertData?.session_id} | Score: {alertData?.score}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none',
            color: '#fff', borderRadius: '50%', padding: '6px', cursor: 'pointer'
          }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: m.sender === 'user' ? 'row' : 'row-reverse',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: m.sender === 'user' ? '#0c192c' : '#0072ff',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {m.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div style={{
                background: m.isSystem ? '#fff3cd' : (m.sender === 'user' ? '#ffffff' : '#0072ff'),
                color: m.isSystem ? '#856404' : (m.sender === 'user' ? '#0f172a' : '#ffffff'),
                padding: '10px 14px', borderRadius: '12px',
                border: m.isSystem ? '1px solid #ffeeba' : '1px solid #e2e8f0',
                fontSize: '0.9rem',
                maxWidth: '75%'
              }}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '16px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
          {!isPaused && (
            <button onClick={handleTakeover} className="btn btn-gold" style={{ width: '100%', marginBottom: '10px' }}>
              Take Over Chat Manually
            </button>
          )}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message to the client..."
              style={{
                flex: 1, padding: '12px 16px', borderRadius: '8px',
                border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none'
              }}
            />
            <button type="submit" disabled={!inputMessage.trim()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Send size={16} /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
