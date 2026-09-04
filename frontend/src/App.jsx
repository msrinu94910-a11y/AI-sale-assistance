import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navigation/Navbar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { BotPlayground } from './components/BotPlayground/BotPlayground';
import { LeadList } from './components/LeadCard/LeadList';
import { LeadDetail } from './components/LeadCard/LeadDetail';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { LeadModal } from './components/Forms/LeadModal';
import { MeetingModal } from './components/Forms/MeetingModal';
import { apiService } from './services/api';
import { Calendar, Clock, CheckCircle, Pencil, Trash2, ArrowLeft } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [summary, setSummary] = useState(null);
  const [meetings, setMeetings] = useState([]);
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  const [editingLead, setEditingLead] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [leadsData, summaryData, meetingsData] = await Promise.all([
        apiService.getLeads(),
        apiService.getAnalyticsSummary(),
        apiService.getMeetings()
      ]);
      setLeads(leadsData);
      setSummary(summaryData);
      setMeetings(meetingsData);
    } catch (err) {
      console.error('Error loading initial app data:', err);
    }
  };

  const handleOpenCreateLead = () => {
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  const handleOpenEditLead = (lead) => {
    setEditingLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = async (leadData) => {
    try {
      if (editingLead) {
        // Edit existing lead
        const updated = await apiService.updateLead(editingLead.id, leadData);
        setLeads((prev) => prev.map((l) => (l.id === editingLead.id ? { ...l, ...updated } : l)));
        if (selectedLead?.id === editingLead.id) {
          setSelectedLead((prev) => ({ ...prev, ...updated }));
        }
        setEditingLead(null);
      } else {
        // Create new lead
        const created = await apiService.createLead(leadData);
        setLeads((prev) => {
          const filtered = prev.filter((l) => l.id !== created.id);
          return [created, ...filtered];
        });

        // Update analytics summary metrics dynamically
        setSummary((prev) => {
          if (!prev) return prev;
          const cat = created.category || 'Warm';
          return {
            ...prev,
            total_leads: (prev.total_leads || 0) + 1,
            hot_leads: cat === 'Hot' ? (prev.hot_leads || 0) + 1 : (prev.hot_leads || 0),
            warm_leads: cat === 'Warm' ? (prev.warm_leads || 0) + 1 : (prev.warm_leads || 0),
            cold_leads: cat === 'Cold' ? (prev.cold_leads || 0) + 1 : (prev.cold_leads || 0),
            recent_activities: [
              {
                time: "Just now",
                action: "New Lead Added",
                detail: `${created.name} (${created.company || 'Enterprise'}) qualified as ${created.category} Lead (Score: ${created.score})`
              },
              ...(prev.recent_activities || [])
            ]
          };
        });

        setActiveTab('leads');
      }
    } catch (err) {
      console.error('Error saving lead:', err);
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      await apiService.deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (selectedLead?.id === leadId) {
        setSelectedLead(null);
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const handleOpenCreateMeeting = () => {
    setEditingMeeting(null);
    setIsMeetingModalOpen(true);
  };

  const handleOpenEditMeeting = (meeting) => {
    setEditingMeeting(meeting);
    setIsMeetingModalOpen(true);
  };

  const handleSaveMeeting = async (meetingData) => {
    try {
      if (editingMeeting) {
        // Edit existing meeting
        const updated = await apiService.updateMeeting(editingMeeting.id, meetingData);
        setMeetings((prev) => prev.map((m) => (m.id === editingMeeting.id ? { ...m, ...updated } : m)));
        setEditingMeeting(null);
      } else {
        // Schedule new meeting
        const created = await apiService.createMeeting(meetingData);
        setMeetings((prev) => [created, ...prev]);
        setActiveTab('meetings');
      }
    } catch (err) {
      console.error('Error saving meeting:', err);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await apiService.deleteMeeting(meetingId);
      setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
    } catch (err) {
      console.error('Error deleting meeting:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLeadModal={handleOpenCreateLead}
        onOpenMeetingModal={handleOpenCreateMeeting}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '24px' }}>
        
        {activeTab === 'dashboard' && (
          <DashboardView
            summary={summary}
            leads={leads}
            setActiveTab={setActiveTab}
            onOpenLeadModal={handleOpenCreateLead}
            onOpenMeetingModal={handleOpenCreateMeeting}
            onSelectLead={(lead) => setSelectedLead(lead)}
          />
        )}

        {activeTab === 'bot' && (
          <BotPlayground
            onLeadOrMeetingUpdated={loadInitialData}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'leads' && (
          <LeadList
            leads={leads}
            onSelectLead={(lead) => setSelectedLead(lead)}
            onOpenLeadModal={handleOpenCreateLead}
            onEditLead={handleOpenEditLead}
            onDeleteLead={handleDeleteLead}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            summary={summary}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'meetings' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  className="btn btn-secondary btn-icon"
                  onClick={() => setActiveTab('dashboard')}
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                  title="Back to Dashboard"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <div>
                  <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Scheduled Meetings & Product Demos</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automated sales calendar integration</p>
                </div>
              </div>
              <button className="btn btn-gold" onClick={handleOpenCreateMeeting}>
                <Calendar size={16} /> Book New Demo
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {meetings.map((m) => (
                <div key={m.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-success">
                      <CheckCircle size={12} /> {m.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {m.duration_minutes} mins
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{m.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#0072ff', marginTop: '2px', fontWeight: '700' }}>
                      {m.lead_name}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: '#eef4fc', padding: '10px', borderRadius: '6px', border: '1px solid #bcccdc' }}>
                    📅 {new Date(m.meeting_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>

                  {m.notes && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Note: {m.notes}
                    </p>
                  )}

                  {/* Card Actions: Edit & Delete */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                    <button
                      className="btn btn-secondary btn-icon"
                      onClick={() => handleOpenEditMeeting(m)}
                      title="Edit Meeting"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-icon"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete meeting "${m.title}"?`)) {
                          handleDeleteMeeting(m.id);
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
          </div>
        )}

      </main>

      {/* Slide-over Lead Detail Drawer */}
      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onScheduleDemo={(lead) => {
            setSelectedLead(null);
            handleOpenCreateMeeting();
          }}
          onEditLead={handleOpenEditLead}
          onDeleteLead={handleDeleteLead}
        />
      )}

      {/* Add / Edit Lead Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setEditingLead(null);
        }}
        onSubmit={handleSaveLead}
        leadToEdit={editingLead}
      />

      {/* Schedule / Edit Meeting Modal */}
      <MeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => {
          setIsMeetingModalOpen(false);
          setEditingMeeting(null);
        }}
        onSubmit={handleSaveMeeting}
        selectedLead={selectedLead}
        meetingToEdit={editingMeeting}
      />

    </div>
  );
}

export default App;
