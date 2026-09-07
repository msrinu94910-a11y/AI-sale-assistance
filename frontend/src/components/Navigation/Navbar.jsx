import React from 'react';
import { 
  LayoutDashboard, 
  Bot,
  Users, 
  BarChart3, 
  Calendar, 
  Plus,
  Code,
  LogIn,
  LogOut,
  User
} from 'lucide-react';

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenLeadModal, 
  onOpenMeetingModal, 
  onOpenEmbedModal,
  currentUser,
  onLogout,
  onOpenLogin
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bot', label: 'Sales Bot API', icon: Bot },
    { id: 'leads', label: 'Leads & Scoring', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
  ];

  const getInitials = (name) => {
    if (!name) return 'SR';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      background: 'linear-gradient(90deg, #0052cc 0%, #0072ff 50%, #00c6ff 100%)', 
      padding: '10px 20px',
      boxShadow: '0 4px 20px rgba(0, 114, 255, 0.25)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Floating Capsule Dark Dock */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#070f1e',
          borderRadius: '9999px',
          padding: '6px 10px 6px 12px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 10px 35px -5px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>

          {/* Left: Brand Logo & Title */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', paddingLeft: '6px' }} 
            onClick={() => setActiveTab('dashboard')}
          >
            <div style={{ 
              height: '36px',
              width: '36px',
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(0, 198, 255, 0.4)',
              overflow: 'hidden'
            }}>
              <img 
                src="/logo.png" 
                alt="SalesBot Logo" 
                style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-main)' }}>
                SalesBot <span style={{ color: '#ff9f00', fontSize: '1rem', fontWeight: '800' }}>AI</span>
              </span>
            </div>
          </div>

          {/* Middle: Horizontal Nav Items */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <Icon size={16} color={isActive ? '#38bdf8' : '#64748b'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: CTA Pill Buttons & User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={onOpenEmbedModal}
              title="Get Embed Code for Website"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '8px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Code size={14} color="#ff9f00" />
              <span>Embed</span>
            </button>

            {currentUser && currentUser.isLoggedIn && (
              <button 
                onClick={onOpenLeadModal}
                style={{
                  background: '#ffffff',
                  color: '#0c192c',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(255, 255, 255, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                <Plus size={15} color="#0072ff" />
                <span>Add Lead</span>
              </button>
            )}

            {/* Auth Profile Section */}
            {currentUser && currentUser.isLoggedIn ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                padding: '4px 8px 4px 6px',
                borderRadius: '9999px',
                marginLeft: '4px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0072ff, #00c6ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  border: '1.5px solid rgba(255, 255, 255, 0.4)'
                }}>
                  {getInitials(currentUser.name)}
                </div>
                <div style={{ textAlign: 'left', paddingRight: '4px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#ffffff', lineHeight: 1.1 }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#ff9f00', fontWeight: '600' }}>
                    {currentUser.role || 'Sales Rep'}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out of Account"
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                style={{
                  background: 'linear-gradient(135deg, #0072ff, #00c6ff)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(0, 114, 255, 0.4)',
                  marginLeft: '4px'
                }}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>

      </div>
    </header>
  );
}

export default Navbar;
