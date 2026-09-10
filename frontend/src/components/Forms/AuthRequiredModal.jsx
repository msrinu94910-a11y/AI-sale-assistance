import React from 'react';
import { Lock, X, LogIn, ShieldAlert } from 'lucide-react';

export function AuthRequiredModal({ isOpen, onClose, onGoToLogin, message }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div className="glass-panel animate-fade-in md-modal-content" style={{
        width: '100%',
        maxWidth: '480px',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        border: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #0c192c 0%, #152a4a 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255, 159, 0, 0.2)',
              border: '1px solid rgba(255, 159, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              flexShrink: 0
            }}>
              <Lock size={20} color="#ff9f00" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                Sign In Required
              </h3>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.2 }}>Authentication Needed</span>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fff3d6',
            border: '2px solid #ffe099',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 8px 20px rgba(255, 159, 0, 0.2)'
          }}>
            <ShieldAlert size={34} color="#ff9f00" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Sign In to Add Lead
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.5, margin: 0, fontWeight: '600' }}>
              {message || "You can only add a lead if you sign in. Please Sign In to create and manage sales leads."}
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{
          padding: '16px 24px 24px 24px',
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onGoToLogin}
            style={{
              flex: 1.4,
              padding: '12px 18px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)',
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px',
              boxShadow: '0 6px 18px rgba(0, 114, 255, 0.35)'
            }}
          >
            <LogIn size={18} />
            <span>Sign In Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthRequiredModal;
