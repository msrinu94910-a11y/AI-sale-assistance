import React, { useState } from 'react';
import { 
  Sparkles,
  LayoutDashboard, 
  Bot,
  Users, 
  BarChart3, 
  Calendar, 
  Plus,
  Code,
  LogIn,
  LogOut,
  User,
  Menu,
  X
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
  const allNavItems = [
    { id: 'landing', label: 'Home', icon: Sparkles, isPublic: true },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, isPublic: false },
    { id: 'bot', label: 'Sales Bot API', icon: Bot, isPublic: false },
    { id: 'leads', label: 'Leads & Scoring', icon: Users, isPublic: false },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, isPublic: false },
    { id: 'meetings', label: 'Meetings', icon: Calendar, isPublic: false },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = allNavItems.filter(item => {
    if (currentUser && currentUser.isLoggedIn) return true;
    return item.isPublic;
  });

  const getInitials = (name) => {
    if (!name) return 'SR';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      background: 'rgba(6, 12, 23, 0.94)', 
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      padding: '8px 24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      <div className="md-nav-scroll" style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        
        {/* Left: Brand Logo & Title */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} 
          onClick={() => setActiveTab('landing')}
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
              style={{ height: '26px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '900', fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-main)' }}>
              SalesBot <span style={{ color: '#ffd700', fontSize: '1rem', fontWeight: '900' }}>AI</span>
            </span>
          </div>
        </div>

        {/* Hamburger Menu Button (Mobile Only) */}
        <button 
          className="mobile-only"
          onClick={() => setIsMobileMenuOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <Menu size={24} />
        </button>

        {/* Middle: Horizontal Nav Items (Desktop Only) */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '4px', maxWidth: '100%' }}>
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
                  padding: '7px 15px',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? '800' : '600',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? 'rgba(0, 114, 255, 0.25)' : 'transparent',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} color={isActive ? '#38bdf8' : '#64748b'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: CTA Buttons & User Profile (Desktop Only) */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '100%' }}>
          {currentUser && currentUser.isLoggedIn && (
            <>
              <button 
                onClick={onOpenEmbedModal}
                title="Get Embed Code for Website"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Code size={14} color="#ffd700" />
                <span>Embed Snippet</span>
              </button>

              <button 
                onClick={onOpenLeadModal}
                style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffae00 100%)',
                  color: '#060c17',
                  border: 'none',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 4px 14px rgba(255, 174, 0, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Plus size={15} color="#060c17" />
                <span>Add Lead</span>
              </button>
            </>
          )}

          {/* Auth Profile Section */}
          {currentUser && currentUser.isLoggedIn ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '4px 8px 4px 6px',
              borderRadius: '9999px'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
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
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.64rem', color: '#ffd700', fontWeight: '700' }}>
                  {currentUser.role || 'Sales Rep'}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out of Account"
                style={{
                  background: 'rgba(239, 68, 68, 0.18)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
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
                background: 'linear-gradient(135deg, #ffd700 0%, #ffb700 100%)',
                color: '#0a111e',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(255, 183, 0, 0.4)'
              }}
            >
              <LogIn size={15} color="#0a111e" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(6, 12, 23, 0.98)',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '900', fontSize: '1.25rem', color: '#ffffff' }}>
                SalesBot <span style={{ color: '#ffd700' }}>AI</span>
              </span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              <X size={28} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive ? 'rgba(0, 114, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: 'none',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={20} color={isActive ? '#38bdf8' : '#64748b'} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {currentUser && currentUser.isLoggedIn ? (
              <>
                <button 
                  onClick={() => { onOpenLeadModal(); setIsMobileMenuOpen(false); }}
                  className="btn btn-gold"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center' }}
                >
                  <Plus size={18} /> Add Lead
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0072ff, #00c6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800' }}>
                      {getInitials(currentUser.name)}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: '700', fontSize: '1rem' }}>{currentUser.name}</div>
                      <div style={{ color: '#ffd700', fontSize: '0.8rem' }}>{currentUser.role}</div>
                    </div>
                  </div>
                  <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} style={{ background: 'transparent', border: 'none', color: '#f87171', padding: '8px' }}>
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => { onOpenLogin(); setIsMobileMenuOpen(false); }}
                className="btn btn-gold"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center' }}
              >
                <LogIn size={18} /> Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
