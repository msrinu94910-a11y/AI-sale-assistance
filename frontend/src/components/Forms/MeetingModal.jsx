import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { apiService } from '../../services/api';

export function MeetingModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  selectedLead, 
  meetingToEdit = null,
  existingMeetings = [] 
}) {
  const [formData, setFormData] = useState({
    lead_name: selectedLead ? `${selectedLead.name} (${selectedLead.company || 'Enterprise'})` : '',
    title: 'Product Demo & Architecture Review',
    meeting_date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    duration_minutes: 30,
    notes: 'Covering AI lead scoring integration and custom workflow automation.'
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [conflictWarning, setConflictWarning] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to extract YYYY-MM-DD string from datetime input
  const getSelectedDateStr = (dateVal) => {
    if (!dateVal) return new Date().toISOString().slice(0, 10);
    return dateVal.slice(0, 10);
  };

  // Reset / Populate form data
  useEffect(() => {
    setSubmitError(null);
    setConflictWarning(null);
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

  // Load intelligent available time slots when date or duration changes
  useEffect(() => {
    if (!isOpen) return;
    const dateStr = getSelectedDateStr(formData.meeting_date);
    const duration = formData.duration_minutes || 30;

    let isMounted = true;
    apiService.getAvailableSlots(dateStr, duration)
      .then(slots => {
        if (isMounted) setAvailableSlots(slots);
      })
      .catch(err => {
        console.warn('Error loading slots:', err);
      });

    return () => { isMounted = false; };
  }, [isOpen, formData.meeting_date, formData.duration_minutes]);

  // Real-time conflict validation check
  useEffect(() => {
    if (!isOpen || !formData.meeting_date) {
      setConflictWarning(null);
      return;
    }

    const proposedStart = new Date(formData.meeting_date).getTime();
    if (isNaN(proposedStart)) {
      setConflictWarning(null);
      return;
    }

    const durationMs = (formData.duration_minutes || 30) * 60000;
    const proposedEnd = proposedStart + durationMs;

    let conflict = null;
    for (const ex of existingMeetings) {
      if (ex.status === 'Cancelled') continue;
      if (meetingToEdit && ex.id === meetingToEdit.id) continue;

      const exStart = new Date(ex.meeting_date).getTime();
      const exEnd = exStart + (ex.duration_minutes || 30) * 60000;

      if (!isNaN(exStart) && proposedStart < exEnd && proposedEnd > exStart) {
        const startTimeStr = new Date(ex.meeting_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        conflict = `Time Slot Conflict: Overlaps with '${ex.title}' for ${ex.lead_name || 'Prospect'} at ${startTimeStr}`;
        break;
      }
    }

    setConflictWarning(conflict);
  }, [isOpen, formData.meeting_date, formData.duration_minutes, existingMeetings, meetingToEdit]);

  if (!isOpen) return null;

  // Handle slot pill click
  const handleSelectSlot = (slot) => {
    try {
      const selectedDate = getSelectedDateStr(formData.meeting_date);
      // Parse time string e.g., "09:00 AM" or datetime iso
      const slotD = new Date(slot.datetime);
      if (!isNaN(slotD.getTime())) {
        const tzOffset = slotD.getTimezoneOffset() * 60000;
        const formatted = new Date(slotD.getTime() - tzOffset).toISOString().slice(0, 16);
        setFormData(prev => ({ ...prev, meeting_date: formatted }));
      }
    } catch (e) {
      console.warn('Error applying slot:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (conflictWarning) {
      setSubmitError(conflictWarning);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        lead_id: selectedLead?.id || null
      });
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'Failed to book meeting due to a conflict or server error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(8px)',
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in md-modal-content" style={{
        width: '100%',
        maxWidth: '520px',
        maxHeight: '88vh',
        overflowY: 'auto',
        padding: '22px 24px',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,114,255,0.3)' }}>
              <Calendar size={22} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {meetingToEdit ? 'Edit Meeting & Product Demo' : 'Schedule Demo & Meeting'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                AI-Assisted Conflict Detection & Slot Booking
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Real-time Conflict Alert Banner */}
        {conflictWarning && (
          <div style={{
            background: '#fef2f2',
            border: '1.5px solid #fca5a5',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            color: '#991b1b',
            fontSize: '0.84rem'
          }}>
            <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', fontWeight: '800', marginBottom: '2px' }}>Time Conflict Warning</strong>
              <span>{conflictWarning}. Please select an available slot below.</span>
            </div>
          </div>
        )}

        {/* Submission Error Banner */}
        {submitError && !conflictWarning && (
          <div style={{
            background: '#fef2f2',
            border: '1.5px solid #fca5a5',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#991b1b',
            fontSize: '0.84rem'
          }}>
            <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
              Lead / Participant *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah Connor (Cyberdyne Systems)"
              value={formData.lead_name}
              onChange={(e) => setFormData({ ...formData, lead_name: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
              Meeting Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>

          <div className="md-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.meeting_date}
                onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: conflictWarning ? '#fff1f2' : '#f8fafc',
                  border: conflictWarning ? '2px solid #ef4444' : '1px solid #cbd5e1',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                Duration (Minutes)
              </label>
              <select
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>
          </div>

          {/* ⚡ INTELLIGENT TIME-SLOT PICKER SECTION */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#0072ff" />
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                  Intelligent Available Time Slots
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600' }}>
                {getSelectedDateStr(formData.meeting_date)}
              </span>
            </div>

            {availableSlots.length === 0 ? (
              <div style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'center', padding: '10px' }}>
                Loading available slots...
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: '8px', maxHeight: '140px', overflowY: 'auto', paddingRight: '4px' }}>
                {availableSlots.map((slot, idx) => {
                  const slotDate = new Date(slot.datetime);
                  const selectedDate = new Date(formData.meeting_date);
                  const isSelected = !isNaN(slotDate) && !isNaN(selectedDate) && Math.abs(slotDate.getTime() - selectedDate.getTime()) < 60000;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => handleSelectSlot(slot)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '8px',
                        fontSize: '0.76rem',
                        fontWeight: '700',
                        border: isSelected 
                          ? '2px solid #0072ff' 
                          : (slot.available ? '1px solid #cbd5e1' : '1px solid #fca5a5'),
                        background: isSelected 
                          ? '#dbeafe' 
                          : (slot.available ? '#ffffff' : '#fef2f2'),
                        color: slot.available ? (isSelected ? '#0072ff' : '#1e293b') : '#991b1b',
                        opacity: slot.available ? 1 : 0.65,
                        cursor: slot.available ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      title={slot.available ? `Click to select ${slot.time}` : `Booked: ${slot.conflict_title || 'Conflict'}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} color={slot.available ? '#0072ff' : '#dc2626'} />
                        <span>{slot.time}</span>
                      </div>
                      <span style={{ fontSize: '0.62rem', fontWeight: '800', color: slot.available ? '#16a34a' : '#dc2626' }}>
                        {slot.available ? '● Available' : '✖ Booked'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
              Agenda & Notes
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting || !!conflictWarning}
              style={{
                opacity: (isSubmitting || !!conflictWarning) ? 0.6 : 1,
                cursor: (isSubmitting || !!conflictWarning) ? 'not-allowed' : 'pointer'
              }}
            >
              <Calendar size={16} /> {meetingToEdit ? 'Update Meeting' : 'Confirm Booking'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
