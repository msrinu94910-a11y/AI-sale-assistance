import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

export function MeetingModal({ isOpen, onClose, onSubmit, selectedLead, meetingToEdit = null }) {
  const [formData, setFormData] = useState({
    lead_name: selectedLead ? `${selectedLead.name} (${selectedLead.company || 'Enterprise'})` : '',
    title: 'Product Demo & Architecture Review',
    meeting_date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    duration_minutes: 30,
    notes: 'Covering AI lead scoring integration and custom workflow automation.'
  });

  useEffect(() => {
    if (meetingToEdit) {
      let formattedDate = new Date(Date.now() + 86400000).toISOString().slice(0, 16);
      if (meetingToEdit.meeting_date) {
        try {
          const d = new Date(meetingToEdit.meeting_date);
          const tzOffset = d.getTimezoneOffset() * 60000;
          formattedDate = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
        } catch (e) {
          console.warn('Date parsing error', e);
        }
      }
      setFormData({
        lead_name: meetingToEdit.lead_name || '',
        title: meetingToEdit.title || '',
        meeting_date: formattedDate,
        duration_minutes: meetingToEdit.duration_minutes || 30,
        notes: meetingToEdit.notes || ''
      });
    } else {
      setFormData({
        lead_name: selectedLead ? `${selectedLead.name} (${selectedLead.company || 'Enterprise'})` : '',
        title: 'Product Demo & Architecture Review',
        meeting_date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        duration_minutes: 30,
        notes: 'Covering AI lead scoring integration and custom workflow automation.'
      });
    }
  }, [isOpen, meetingToEdit, selectedLead]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      lead_id: selectedLead?.id || null
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(8px)',
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '28px', background: '#ffffff' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {meetingToEdit ? 'Edit Meeting & Product Demo' : 'Schedule Demo & Meeting'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI-Assisted Calendar Booking</span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Lead / Participant *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah Connor (Cyberdyne Systems)"
              value={formData.lead_name}
              onChange={(e) => setFormData({ ...formData, lead_name: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Meeting Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.meeting_date}
                onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Duration (Mins)</label>
              <select
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Agenda & Notes</label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Calendar size={16} /> {meetingToEdit ? 'Update Meeting' : 'Confirm Booking'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
