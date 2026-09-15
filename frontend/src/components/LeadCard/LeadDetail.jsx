import React from 'react';
import { X, Flame, Building, Mail, Phone, Calendar, Pencil, Trash2 } from 'lucide-react';

export function LeadDetail({ lead, onClose, onScheduleDemo, onEditLead, onDeleteLead }) {
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
      zIndex: 10000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="glass-panel animate-fade-in md-drawer-content" style={{
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
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Close Details">
            <X size={22} />
          </button>
        </div>

        {/* Lead Title Info */}
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{lead.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <Building size={16} />
            <span>{lead.location_preference || 'No Location specified'}</span>
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

        {/* Property Preferences Display */}
        <div>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '12px' }}>Property Preferences</h3>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Location:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{lead.location_preference || 'Any'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Property Type:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{lead.property_type_preference || 'Any'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>BHK:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{lead.bhk_preference || 'Any'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Max Budget:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{lead.budget_max ? `₹${(lead.budget_max/100000).toFixed(1)} Lakhs` : 'Any'}</strong>
            </div>
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
            <span>Schedule Site Visit for {lead.name}</span>
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                if (onEditLead) onEditLead(lead);
              }}
            >
              <Pencil size={16} />
              <span>Edit Lead</span>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete lead "${lead.name}"?`)) {
                  onClose();
                  if (onDeleteLead) onDeleteLead(lead.id);
                }
              }}
            >
              <Trash2 size={16} />
              <span>Delete Lead</span>
            </button>
          </div>

          <button className="btn btn-secondary" onClick={onClose} style={{ marginTop: '4px' }}>
            <span>Close Details</span>
          </button>
        </div>

      </div>
    </div>
  );
}
