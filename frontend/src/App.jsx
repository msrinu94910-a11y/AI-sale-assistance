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
import { Calendar, Clock, CheckCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [summary, setSummary] = useState(null);
  const [meetings, setMeetings] = useState([]);
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

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

  const handleAddLead = async (newLeadData) => {
    try {
      const created = await apiService.createLead(newLeadData);
      
      // Update leads list state immediately
      setLeads((prev) => {
        const filtered = prev.filter(l => l.id !== created.id);
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

      // Switch to Leads tab so the user sees their new lead immediately!
      setActiveTab('leads');
    } catch (err) {
      console.error('Error creating new lead:', err);
    }
  };

  const handleScheduleMeeting = async (meetingData) => {
    try {
      const created = await apiService.createMeeting(meetingData);
      setMeetings((prev) => [created, ...prev]);
      setActiveTab('meetings');
    } catch (err) {
      console.error('Error scheduling meeting:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLeadModal={() => setIsLeadModalOpen(true)}
        onOpenMeetingModal={() => setIsMeetingModalOpen(true)}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '24px' }}>
        
        {activeTab === 'dashboard' && (
          <DashboardView
            summary={summary}
            leads={leads}
            setActiveTab={setActiveTab}
            onOpenLeadModal={() => setIsLeadModalOpen(true)}
            onOpenMeetingModal={() => setIsMeetingModalOpen(true)}
          />
        )}

        {activeTab === 'bot' && (
          <BotPlayground
            onLeadOrMeetingUpdated={loadInitialData}
          />
        )}

        {activeTab === 'leads' && (
          <LeadList
            leads={leads}
            onSelectLead={(lead) => setSelectedLead(lead)}
            onOpenLeadModal={() => setIsLeadModalOpen(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            summary={summary}
          />
        )}

        {activeTab === 'meetings' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Scheduled Meetings & Product Demos</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automated sales calendar integration</p>
              </div>
              <button className="btn btn-gold" onClick={() => setIsMeetingModalOpen(true)}>
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
            setIsMeetingModalOpen(true);
          }}
        />
      )}

      {/* Add Lead Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSubmit={handleAddLead}
      />

      {/* Schedule Meeting Modal */}
      <MeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        onSubmit={handleScheduleMeeting}
        selectedLead={selectedLead}
      />

    </div>
  );
}

export default App;
