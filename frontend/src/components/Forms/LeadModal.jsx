import React, { useState, useEffect } from 'react';
import { X, Sparkles, User, Flame } from 'lucide-react';

export function LeadModal({ isOpen, onClose, onSubmit, leadToEdit = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'New',
    location_preference: '',
    property_type_preference: '',
    bhk_preference: '',
    budget_max: '',
    notes: ''
  });

  useEffect(() => {
    if (leadToEdit) {
      setFormData({
        name: leadToEdit.name || '',
        email: leadToEdit.email || '',
        phone: leadToEdit.phone || '',
        status: leadToEdit.status || 'New',
        location_preference: leadToEdit.location_preference || '',
        property_type_preference: leadToEdit.property_type_preference || '',
        bhk_preference: leadToEdit.bhk_preference || '',
        budget_max: leadToEdit.budget_max || '',
        notes: leadToEdit.notes || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'New',
        location_preference: '',
        property_type_preference: '',
        bhk_preference: '',
        budget_max: '',
        notes: ''
      });
    }
  }, [isOpen, leadToEdit]);

  if (!isOpen) return null;

  let score = 50;
  if (formData.location_preference) score += 10;
  if (formData.budget_max) score += 20;
  if (formData.bhk_preference || formData.property_type_preference) score += 10;
  if (formData.phone || formData.email) score += 10;

  const category = score >= 71 ? 'Hot' : score >= 41 ? 'Warm' : 'Cold';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    const parsedData = {
      ...formData,
      bhk_preference: formData.bhk_preference ? parseInt(formData.bhk_preference) : null,
      budget_max: formData.budget_max ? parseInt(formData.budget_max) : null,
    };
    
    onSubmit(parsedData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'New',
      location_preference: '',
      property_type_preference: '',
      bhk_preference: '',
      budget_max: '',
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
      <div className="glass-panel animate-fade-in md-modal-content" style={{
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
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: '800' }}>
                {leadToEdit ? 'Edit Lead Details' : 'Add New Lead'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Property Preference Qualification</span>
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
            <div className="md-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

            <div className="md-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>Location Preference</label>
                <input
                  type="text"
                  placeholder="e.g. Gachibowli"
                  value={formData.location_preference}
                  onChange={(e) => setFormData({ ...formData, location_preference: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* Property Preferences */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div className="md-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>Property Type</label>
                  <select
                    value={formData.property_type_preference}
                    onChange={(e) => setFormData({ ...formData, property_type_preference: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem' }}
                  >
                    <option value="">Any</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>BHK</label>
                  <input
                    type="number"
                    placeholder="e.g. 3"
                    value={formData.bhk_preference}
                    onChange={(e) => setFormData({ ...formData, bhk_preference: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>Max Budget (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15000000"
                    value={formData.budget_max}
                    onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Live Score Preview Banner */}
            <div style={{ background: '#e6f0ff', padding: '14px 18px', borderRadius: '12px', border: '1px solid #b8d5ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#0052cc', fontWeight: '700' }}>Calculated Qualification Score</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#003399' }}>{score} / 100</div>
              </div>
              <span className={`badge badge-${category.toLowerCase()}`} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                <Flame size={14} /> {category} Category
              </span>
            </div>

            {/* Notes */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>Lead Notes</label>
              <textarea
                rows="2"
                placeholder="Specific requirements, amenities requested..."
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
            justifyContent: 'flex-end',
            gap: '12px',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
            zIndex: 10
          }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '10px 20px' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-gold" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              <Sparkles size={18} /> {leadToEdit ? 'Update Lead Details' : 'Save & Qualify Lead'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
