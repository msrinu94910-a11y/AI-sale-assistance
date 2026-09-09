import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  Pencil,
  Trash2,
  ArrowLeft,
  Video,
  ExternalLink,
  Download,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Plus,
  User,
  Sparkles,
  Check,
  Filter,
  Flame,
  CalendarDays,
  X,
  Info
} from 'lucide-react';

export function MeetingsView({
  meetings = [],
  onOpenCreateMeeting,
  onEditMeeting,
  onDeleteMeeting,
  onBack,
  currentUser
}) {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Helper: Format date for Google Calendar URL (YYYYMMDDTHHMMSSZ)
  const formatGoogleCalendarDate = (dateObj) => {
    return dateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  // Helper: Open Google Calendar in new tab
  const handleAddToGoogleCalendar = (meeting) => {
    const start = new Date(meeting.meeting_date);
    const durationMs = (meeting.duration_minutes || 30) * 60 * 1000;
    const end = new Date(start.getTime() + durationMs);

    const title = encodeURIComponent(meeting.title || 'SalesBot Product Demo');
    const details = encodeURIComponent(
      `Sales Prospect: ${meeting.lead_name || 'Prospect'}\nNotes: ${meeting.notes || 'Automated BANT Lead Demo'}\nJoin Video Call: https://meet.jit.si/SalesBot-Demo-${meeting.id}`
    );
    const dates = `${formatGoogleCalendarDate(start)}/${formatGoogleCalendarDate(end)}`;

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=Online+Video+Call`;
    window.open(googleCalUrl, '_blank');
  };

  // Helper: Download .ics iCalendar file
  const handleDownloadICS = (meeting) => {
    const start = new Date(meeting.meeting_date);
    const durationMs = (meeting.duration_minutes || 30) * 60 * 1000;
    const end = new Date(start.getTime() + durationMs);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SalesBot AI//Sales Assistant Meetings//EN',
      'BEGIN:VEVENT',
      `UID:meeting-${meeting.id}@salesbot.ai`,
      `DTSTAMP:${formatGoogleCalendarDate(new Date())}`,
      `DTSTART:${formatGoogleCalendarDate(start)}`,
      `DTEND:${formatGoogleCalendarDate(end)}`,
      `SUMMARY:${meeting.title || 'SalesBot Product Demo'}`,
      `DESCRIPTION:Prospect: ${meeting.lead_name || 'Lead'}\\nNote: ${meeting.notes || ''}\\nVideo: https://meet.jit.si/SalesBot-Demo-${meeting.id}`,
      'LOCATION:Online Video Room',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `SalesBot-Meeting-${meeting.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Month Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date();

  // Calendar Grid calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper function to extract robust YYYY-MM-DD key from date input
  const getMeetingDateKey = (dateInput) => {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Group meetings by day string (YYYY-MM-DD) based on local timezone
  const meetingsByDate = meetings.reduce((acc, m) => {
    const key = getMeetingDateKey(m.meeting_date);
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  // Automatically default selectedDate to the first date with demos if current selectedDate has none
  useEffect(() => {
    if (!selectedDate && meetings.length > 0) {
      const dateKeys = Object.keys(meetingsByDate);
      if (dateKeys.length > 0) {
        // Pick the date with the most demos or first date
        const sorted = [...dateKeys].sort((a, b) => (meetingsByDate[b]?.length || 0) - (meetingsByDate[a]?.length || 0));
        setSelectedDate(sorted[0]);
      }
    }
  }, [meetings]);

  // Format nice readable date header
  const getReadableDateString = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter meetings accurately using computed local date grouping
  const filteredMeetings = selectedDate
    ? (meetingsByDate[selectedDate] || [])
    : meetings;

  const handleCellClick = (dateKey) => {
    setSelectedDate(dateKey);
    setTimeout(() => {
      document.getElementById('demos-inspector-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Top Header Panel */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            className="btn btn-secondary btn-icon"
            onClick={onBack}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Scheduled Meetings & Demos</span>
              <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                {meetings.length} Total Demos
              </span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
              Interactive sales calendar sync (Google Calendar, iCal .ics & Video Call Rooms)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* View Switcher Pills */}
          <div style={{ background: '#e2e8f0', padding: '4px', borderRadius: '9999px', display: 'flex', gap: '2px' }}>
            <button
              onClick={() => setViewMode('calendar')}
              style={{
                background: viewMode === 'calendar' ? '#ffffff' : 'transparent',
                color: viewMode === 'calendar' ? '#0f172a' : '#64748b',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: viewMode === 'calendar' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Grid size={14} color={viewMode === 'calendar' ? '#0072ff' : '#64748b'} />
              <span>Calendar View</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? '#ffffff' : 'transparent',
                color: viewMode === 'list' ? '#0f172a' : '#64748b',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: viewMode === 'list' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <List size={14} color={viewMode === 'list' ? '#0072ff' : '#64748b'} />
              <span>List View</span>
            </button>
          </div>

          <button className="btn btn-gold" onClick={onOpenCreateMeeting}>
            <Plus size={16} /> Book New Demo
          </button>
        </div>
      </div>

      {/* 📅 INTERACTIVE CALENDAR GRID VIEW */}
      {viewMode === 'calendar' && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Calendar Month Header & Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarIcon size={20} color="#0072ff" />
                <span>{monthNames[month]} {year}</span>
              </h3>
              <button
                onClick={() => {
                  setCurrentDate(new Date());
                  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                  handleCellClick(todayStr);
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 10px', fontWeight: '700' }}
              >
                Today
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={prevMonth}
                className="btn btn-secondary btn-icon"
                style={{ padding: '6px 12px' }}
                title="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextMonth}
                className="btn btn-secondary btn-icon"
                style={{ padding: '6px 12px' }}
                title="Next Month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Quick Notice Tip Banner */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#166534' }}>
            <Info size={16} color="#16a34a" />
            <span>
              <strong>Tip:</strong> Click on any date cell or badge below to instantly view all prospect demo details, join video calls, or export calendar events!
            </span>
          </div>

          {/* Days of Week Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={i} style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Month Day Cells Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>

            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} style={{ minHeight: '110px', background: '#f8fafc', borderRadius: '10px', opacity: 0.4 }} />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
              const dayNum = dayIdx + 1;
              const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayMeetings = meetingsByDate[dateKey] || [];
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === dayNum;
              const isSelected = selectedDate === dateKey;
              const hasMeetings = dayMeetings.length > 0;

              return (
                <div
                  key={dayNum}
                  onClick={() => handleCellClick(dateKey)}
                  style={{
                    minHeight: '110px',
                    background: isSelected
                      ? '#dbeafe'
                      : (isToday ? '#eff6ff' : (hasMeetings ? '#f8fafc' : '#ffffff')),
                    border: isSelected
                      ? '2.5px solid #0072ff'
                      : (isToday ? '2px solid #3b82f6' : (hasMeetings ? '1.5px solid #93c5fd' : '1px solid #e2e8f0')),
                    borderRadius: '12px',
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected
                      ? '0 0 20px rgba(0, 114, 255, 0.35)'
                      : (hasMeetings ? '0 4px 12px rgba(0, 114, 255, 0.1)' : 'none'),
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = '#0072ff';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = isToday ? '#3b82f6' : (hasMeetings ? '#93c5fd' : '#e2e8f0');
                  }}
                >
                  {/* Top Row: Date Number & Demo Count Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.88rem',
                      fontWeight: '800',
                      background: isToday ? '#0072ff' : (isSelected ? '#0284c7' : 'transparent'),
                      color: isToday || isSelected ? '#ffffff' : '#1e293b',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {dayNum}
                    </span>

                    {hasMeetings && (
                      <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '3px 8px', fontWeight: '800', boxShadow: '0 2px 6px rgba(255,159,0,0.3)' }}>
                        🔥 {dayMeetings.length} Demo{dayMeetings.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Scheduled Meetings Preview (Capped at 2 items for clean UX) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                    {dayMeetings.slice(0, 2).map((m) => (
                      <div
                        key={m.id}
                        title={`${m.title} with ${m.lead_name}`}
                        style={{
                          background: 'linear-gradient(135deg, #0072ff 0%, #0052cc 100%)',
                          color: '#ffffff',
                          padding: '4px 7px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Clock size={11} color="#ffd700" />
                        <span style={{ fontWeight: '800' }}>
                          {new Date(m.meeting_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {m.lead_name || m.title}
                        </span>
                      </div>
                    ))}

                    {/* +N More Demos Summary Pill */}
                    {dayMeetings.length > 2 && (
                      <div
                        style={{
                          background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                          color: '#ffffff',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          textAlign: 'center',
                          marginTop: '2px',
                          boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>+ {dayMeetings.length - 2} more demos</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* 🗂️ DEDICATED DEMO SCHEDULE INSPECTOR PANEL */}
      <div id="demos-inspector-section" className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Inspector Filter & Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {selectedDate ? (
                  <span>Demos Scheduled for {getReadableDateString(selectedDate)}</span>
                ) : (
                  <span>All Upcoming Scheduled Demos</span>
                )}
                <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                  {filteredMeetings.length} Meeting{filteredMeetings.length !== 1 ? 's' : ''}
                </span>
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                {selectedDate ? 'Click "Clear Date Filter" to view all dates' : 'Select any date cell in the calendar above to inspect specific day demos'}
              </p>
            </div>
          </div>

          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="btn btn-secondary btn-icon"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <Filter size={14} /> Clear Date Filter
            </button>
          )}
        </div>

        {/* Demo Cards Grid */}
        {filteredMeetings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <CalendarIcon size={36} color="#94a3b8" style={{ marginBottom: '8px' }} />
            <h4 style={{ color: '#334155', fontSize: '1.05rem', margin: '4px 0' }}>No Demos Scheduled for this Date</h4>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>Click "Book New Demo" above to schedule a new product demo.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px', marginTop: '8px' }}>
            {filteredMeetings.map((m) => (
              <div key={m.id} className="glass-panel animate-fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', background: '#ffffff' }}>

                {/* Card Header Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> {m.status || 'SCHEDULED'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                    <Clock size={13} color="#0072ff" /> {m.duration_minutes || 30} mins
                  </span>
                </div>

                {/* Meeting Title & Lead */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                    {m.title}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#0072ff', marginTop: '4px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={15} /> {m.lead_name || 'Prospect'}
                  </div>
                </div>

                {/* Date Banner */}
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', background: '#eff6ff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarIcon size={16} color="#0072ff" />
                  <span>{new Date(m.meeting_date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
                </div>

                {m.notes && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0, background: '#fafafa', padding: '8px 10px', borderRadius: '6px', border: '1px border-dashed #e2e8f0' }}>
                    <strong>Note:</strong> {m.notes}
                  </p>
                )}

                {/* ⚡ CALENDAR SYNC & VIDEO CALL ACTIONS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>

                  {/* Join Live Video Meeting Button */}
                  <button
                    onClick={() => window.open(`https://meet.jit.si/SalesBot-Demo-${m.id}`, '_blank')}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '9px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                    }}
                  >
                    <Video size={15} />
                    <span>Join Video Call Room</span>
                    <ExternalLink size={12} />
                  </button>

                  {/* Google Calendar & .ics Download Buttons Row */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleAddToGoogleCalendar(m)}
                      style={{
                        flex: 1,
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#1e293b',
                        padding: '7px 10px',
                        borderRadius: '8px',
                        fontSize: '0.76rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }}
                    >
                      <CalendarIcon size={13} color="#ea4335" />
                      <span>Google Calendar</span>
                    </button>

                    <button
                      onClick={() => handleDownloadICS(m)}
                      style={{
                        flex: 1,
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#1e293b',
                        padding: '7px 10px',
                        borderRadius: '8px',
                        fontSize: '0.76rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }}
                    >
                      <Download size={13} color="#0072ff" />
                      <span>Download .ics</span>
                    </button>
                  </div>

                </div>

                {/* Card Edit & Delete Controls */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '8px' }}>
                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={() => onEditMeeting(m)}
                    title="Edit Meeting Details"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-icon"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete meeting "${m.title}"?`)) {
                        onDeleteMeeting(m.id);
                      }
                    }}
                    title="Delete Meeting"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default MeetingsView;
