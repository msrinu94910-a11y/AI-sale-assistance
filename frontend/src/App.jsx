import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navigation/Navbar';
import { LandingPage } from './components/LandingPage/LandingPage';
import { DashboardView } from './components/Dashboard/DashboardView';
import { BotPlayground } from './components/BotPlayground/BotPlayground';
import { LeadList } from './components/LeadCard/LeadList';
import { LeadDetail } from './components/LeadCard/LeadDetail';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { LeadModal } from './components/Forms/LeadModal';
import { MeetingModal } from './components/Forms/MeetingModal';
import { ImportCSVModal } from './components/Forms/ImportCSVModal';
import { AuthRequiredModal } from './components/Forms/AuthRequiredModal';
import { FloatingChatWidget } from './components/FloatingWidget/FloatingChatWidget';
import { EmbedCodeModal } from './components/FloatingWidget/EmbedCodeModal';
import { LoginPage } from './components/Auth/LoginPage';
import { MeetingsView } from './components/Meetings/MeetingsView';
import { apiService } from './services/api';
import { Calendar, Clock, CheckCircle, Pencil, Trash2, ArrowLeft } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [currentUser, setCurrentUser] = useState(() => apiService.getCurrentUser());
  const [leads, setLeads] = useState([]);
  const [summary, setSummary] = useState(null);
  const [meetings, setMeetings] = useState([]);
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isImportCSVModalOpen, setIsImportCSVModalOpen] = useState(false);

  const [editingLead, setEditingLead] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [loginNotice, setLoginNotice] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (loginNotice && loginNotice.includes('add new leads')) {
      setLoginNotice('');
      setActiveTab('leads');
      setIsLeadModalOpen(true);
    } else {
      setLoginNotice('');
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
    setLoginNotice('');
    setActiveTab('login');
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Protect Dashboard & Workspace views — open Sign In if not logged in
  useEffect(() => {
    const protectedTabs = ['dashboard', 'bot', 'leads', 'analytics', 'meetings'];
    if (protectedTabs.includes(activeTab) && (!currentUser || !currentUser.isLoggedIn)) {
      setLoginNotice('Please Sign In or Create an Account to access the Sales Bot API & Workspace.');
      setActiveTab('login');
    }
  }, [activeTab, currentUser]);

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
    if (!currentUser || !currentUser.isLoggedIn) {
      setAuthModalMessage("You can only add a lead if you sign in. Please Sign In to create and manage sales leads.");
      setIsAuthModalOpen(true);
      return;
    }
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  const handleOpenEditLead = (lead) => {
    if (!currentUser || !currentUser.isLoggedIn) {
      setAuthModalMessage("You can only edit a lead if you sign in. Please Sign In to modify lead details.");
      setIsAuthModalOpen(true);
      return;
    }
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
    if (!currentUser || !currentUser.isLoggedIn) {
      setLoginNotice('Please Sign In or Create an Account to delete leads.');
      setActiveTab('login');
      return;
    }
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

  const handleExportCSV = async (category) => {
    try {
      await apiService.exportLeadsCSV(category);
    } catch (err) {
      console.error('Error exporting leads CSV:', err);
    }
  };

  const handleOpenImportCSVModal = () => {
    if (!currentUser || !currentUser.isLoggedIn) {
      setAuthModalMessage("You can only import leads if you sign in. Please Sign In to bulk import sales leads.");
      setIsAuthModalOpen(true);
      return;
    }
    setIsImportCSVModalOpen(true);
  };

  const handleImportCSVSuccess = async (result) => {
    await loadInitialData();
  };

  const handleOpenCreateMeeting = () => {
    if (!currentUser || !currentUser.isLoggedIn) {
      setLoginNotice('Please Sign In or Create an Account to schedule demo meetings.');
      setActiveTab('login');
      return;
    }
    setEditingMeeting(null);
    setIsMeetingModalOpen(true);
  };

  const handleOpenEditMeeting = (meeting) => {
    if (!currentUser || !currentUser.isLoggedIn) {
      setLoginNotice('Please Sign In or Create an Account to edit meetings.');
      setActiveTab('login');
      return;
    }
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
        return updated;
      } else {
        // Schedule new meeting
        const created = await apiService.createMeeting(meetingData);
        setMeetings((prev) => [created, ...prev]);
        setActiveTab('meetings');
        return created;
      }
    } catch (err) {
      console.error('Error saving meeting:', err);
      throw err;
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!currentUser || !currentUser.isLoggedIn) {
      setLoginNotice('Please Sign In or Create an Account to delete meetings.');
      setActiveTab('login');
      return;
    }
    try {
      await apiService.deleteMeeting(meetingId);
      setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
    } catch (err) {
      console.error('Error deleting meeting:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Global Navbar - Hidden on Sign In Page */}
      {activeTab !== 'login' && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenLeadModal={handleOpenCreateLead}
          onOpenMeetingModal={handleOpenCreateMeeting}
          onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenLogin={() => {
            setLoginNotice('');
            setActiveTab('login');
          }}
        />
      )}

      {/* Main Container */}
      <main className="md-p-3" style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '24px', minWidth: 0 }}>
        
        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={setActiveTab}
            onOpenLeadModal={handleOpenCreateLead}
            onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => {
              setLoginNotice('');
              setActiveTab('landing');
            }}
            noticeMessage={loginNotice}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            summary={summary}
            leads={leads}
            setActiveTab={setActiveTab}
            onOpenLeadModal={handleOpenCreateLead}
            onOpenMeetingModal={handleOpenCreateMeeting}
            onSelectLead={(lead) => setSelectedLead(lead)}
            currentUser={currentUser}
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
            currentUser={currentUser}
            onExportCSV={handleExportCSV}
            onOpenImportModal={handleOpenImportCSVModal}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            summary={summary}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'meetings' && (
          <MeetingsView
            meetings={meetings}
            onOpenCreateMeeting={handleOpenCreateMeeting}
            onEditMeeting={handleOpenEditMeeting}
            onDeleteMeeting={handleDeleteMeeting}
            onBack={() => setActiveTab('dashboard')}
            currentUser={currentUser}
          />
        )}

      </main>

      {/* Floating Website Chat Widget (<script> / Embeddable Mode) - Hidden when viewing Lead Detail drawer */}
      {!selectedLead && (
        <FloatingChatWidget
          onLeadOrMeetingUpdated={loadInitialData}
          onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
        />
      )}

      {/* Embed Code Snippet Generator Modal */}
      <EmbedCodeModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
      />

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
        existingMeetings={meetings}
      />

      {/* Auth Required Popup Message Modal */}
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onGoToLogin={() => {
          setIsAuthModalOpen(false);
          setLoginNotice("You can only add a lead if you sign in. Please Sign In to continue.");
          setActiveTab('login');
        }}
        message={authModalMessage}
      />

      {/* Bulk Import CSV Modal */}
      <ImportCSVModal
        isOpen={isImportCSVModalOpen}
        onClose={() => setIsImportCSVModalOpen(false)}
        onImportSuccess={handleImportCSVSuccess}
      />

    </div>
  );
}

export default App;
