import React from 'react';
import { X, Flame, Building, Mail, Phone, Calendar } from 'lucide-react';

export function LeadDetail({ lead, onClose, onScheduleDemo }) {
  if (!lead) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(6px)',
      zIndex: 200,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '460px',
        height: '100%',
        borderRadius: '0',
        borderRight: 'none',
        padding: '28px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background: '#ffffff'
      }}>
        
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={`badge badge-${lead.category.toLowerCase()}`}>
            <Flame size={14} /> {lead.category} Lead ({lead.score} / 100)
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Lead Title Info */}
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{lead.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <Building size={16} />
            <span>{lead.company || 'Private Enterprise'}</span>
          </div>
        </div>

        {/* Contact Information */}
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Mail size={16} color="var(--accent-primary)" />
            <span>{lead.email}</span>
          </div>
          {lead.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Phone size={16} color="var(--accent-emerald)" />
              <span>{lead.phone}</span>
            </div>
          )}
        </div>

        {/* BANT Breakdown Sliders Display */}
        <div>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '12px' }}>BANT Lead Qualification Scores</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Budget (25%)', val: lead.budget || 50, color: '#e11d48' },
              { label: 'Need (30%)', val: lead.need || 50, color: '#0284c7' },
              { label: 'Authority (20%)', val: lead.authority || 50, color: '#7c3aed' },
              { label: 'Timeline (25%)', val: lead.timeline || 50, color: '#059669' }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>{item.label}</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{item.val} / 100</strong>
                </div>
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.val}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {lead.notes && (
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '6px' }}>AI Lead Notes</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {lead.notes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn btn-primary" onClick={() => onScheduleDemo(lead)}>
            <Calendar size={18} />
            <span>Schedule Demo for {lead.name}</span>
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            <span>Close Details</span>
          </button>
        </div>

      </div>
    </div>
  );
}
