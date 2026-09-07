import React, { useState } from 'react';
import { X, Copy, Check, Code, Sparkles, ExternalLink, HelpCircle, Terminal } from 'lucide-react';

export function EmbedCodeModal({ isOpen, onClose }) {
  const [themeColor, setThemeColor] = useState('#0072ff');
  const [position, setPosition] = useState('bottom-right');
  const [welcomeBanner, setWelcomeBanner] = useState(true);
  const [botTitle, setBotTitle] = useState('SalesBot AI Assistant');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const origin = window.location.origin;
  const scriptUrl = `${origin}/widget.js`;

  const embedCodeSnippet = `<!-- SalesBot AI Embeddable Chat Widget -->
<script
  src="${scriptUrl}"
  data-bot-id="salesbot-ai"
  data-api-url="http://localhost:8000/api/v1"
  data-color="${themeColor}"
  data-position="${position}"
  data-welcome="${welcomeBanner}"
  data-title="${botTitle}">
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(10, 25, 47, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          background: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0c192c 0%, #1a2b4c 100%)',
            color: '#ffffff',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', color: 'var(--logo-gold-bright)' }}>
              <Code size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: '700' }}>
                Embed Chat Widget on Website
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Copy & paste 1 line of HTML code to deploy on any live public website
              </p>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-icon"
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: '80vh' }}>
          
          {/* Config Controls Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            
            {/* Widget Title */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Widget Header Title
              </label>
              <input
                type="text"
                value={botTitle}
                onChange={(e) => setBotTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* Brand Primary Color */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Branding Accent Color
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {['#0072ff', '#ff9f00', '#10b981', '#4f46e5', '#0c192c'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setThemeColor(color)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: color,
                      border: themeColor === color ? '3px solid #0a192f' : '2px solid #ffffff',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Position */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Widget Alignment
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  background: '#ffffff'
                }}
              >
                <option value="bottom-right">Bottom Right Corner</option>
                <option value="bottom-left">Bottom Left Corner</option>
              </select>
            </div>

          </div>

          {/* Welcome Banner Toggle */}
          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Enable Welcome Greeting Popup
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Automatically displays a friendly prompt balloon on initial page visit
              </div>
            </div>
            <input
              type="checkbox"
              checked={welcomeBanner}
              onChange={(e) => setWelcomeBanner(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          {/* Code Snippet Box */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={16} /> Embed Code Snippet
              </span>
              <button
                className={`btn ${isCopied ? 'btn-success' : 'btn-gold'}`}
                onClick={handleCopyCode}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Snippet'}</span>
              </button>
            </div>

            <pre
              style={{
                background: '#0c192c',
                color: '#38bdf8',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontFamily: 'Consolas, Monaco, monospace',
                overflowX: 'auto',
                border: '1px solid #1e293b',
                lineHeight: 1.5
              }}
            >
              <code>{embedCodeSnippet}</code>
            </pre>
          </div>

          {/* Platform Installation Quick Guide */}
          <div style={{ background: '#eef4fc', padding: '16px', borderRadius: '12px', border: '1px solid #bcccdc' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#0072ff', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={15} /> How to Install on Platforms
            </h4>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>WordPress / Custom HTML:</strong> Paste snippet before the closing <code>&lt;/body&gt;</code> tag in your theme.</li>
              <li><strong>Webflow / Wix / Squarespace:</strong> Paste snippet into Custom Code → Footer Embed.</li>
              <li><strong>Shopify:</strong> Add snippet inside <code>theme.liquid</code> layout template.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default EmbedCodeModal;
