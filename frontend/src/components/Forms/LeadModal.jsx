import React, { useState } from 'react';
import { X, Sparkles, User, Flame } from 'lucide-react';

export function LeadModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    budget: 50,
    need: 50,
    authority: 50,
    timeline: 50,
    notes: ''
  });

  if (!isOpen) return null;

  const score = Math.round(
    (formData.budget * 0.25) +
    (formData.need * 0.30) +
    (formData.authority * 0.20) +
    (formData.timeline * 0.25)
  );
  const category = score >= 71 ? 'Hot' : score >= 41 ? 'Warm' : 'Cold';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    onSubmit(formData);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'New',
      budget: 50,
      need: 50,
      authority: 50,
      timeline: 50,
      notes: ''
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(8px)',
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '580px',
        maxHeight: '85vh',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Modal Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #0072ff, #00c6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,114,255,0.3)' }}>
              <User size={22} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: '800' }}>Add New Lead</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Automated BANT Qualification Scoring</span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Basic Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>Lead Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>Company Name</label>
                <input
                  type="text"
                  placeholder="Cyberdyne Systems"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 555-0192"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* Live Score Preview Banner */}
            <div style={{ background: '#e6f0ff', padding: '14px 18px', borderRadius: '12px', border: '1px solid #b8d5ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#0052cc', fontWeight: '700' }}>Calculated BANT Lead Score</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#003399' }}>{score} / 100</div>
              </div>
              <span className={`badge badge-${category.toLowerCase()}`} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                <Flame size={14} /> {category} Category
              </span>
            </div>

            {/* BANT Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {[
                { label: 'Budget Allocation (25%)', key: 'budget' },
                { label: 'Need Alignment (30%)', key: 'need' },
                { label: 'Decision Authority (20%)', key: 'authority' },
                { label: 'Purchase Timeline Urgency (25%)', key: 'timeline' }
              ].map((item) => (
                <div key={item.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '2px', fontWeight: '700' }}>
                    <span>{item.label}</span>
                    <strong style={{ color: '#0072ff' }}>{formData[item.key]}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData[item.key]}
                    onChange={(e) => setFormData({ ...formData, [item.key]: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: '#0072ff', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>

            {/* Notes */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>Lead Qualification Notes</label>
              <textarea
                rows="2"
                placeholder="Primary use case, tech stack requirements..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Sticky Footer Bar with Prominent Save Button */}
          <div style={{
            position: 'sticky',
            bottom: 0,
            background: '#ffffff',
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justify: 'flex-end',
            gap: '12px',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
            zIndex: 10
          }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '10px 20px' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-gold" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              <Sparkles size={18} /> Save & Qualify Lead
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
