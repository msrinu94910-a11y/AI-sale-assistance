import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Building, 
  Zap, 
  Bot, 
  BarChart3, 
  Calendar,
  LogIn,
  UserPlus
} from 'lucide-react';
import { apiService } from '../../services/api';

export function LoginPage({ onLoginSuccess, onCancel }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior Sales Lead');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleQuickDemoLogin = async (demoUser) => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const loggedUser = await apiService.login(demoUser.email, 'password123');
      setSuccessMsg(`Welcome back, ${loggedUser.name}! Logging you in...`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(loggedUser);
      }, 600);
    } catch (err) {
      setErrorMsg('Quick login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (mode === 'register' && !name) {
      setErrorMsg('Please provide your full name.');
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (mode === 'login') {
        result = await apiService.login(email, password);
        setSuccessMsg(`Successfully authenticated as ${result.name}! Redirecting...`);
      } else {
        result = await apiService.register(name, email, password, role);
        setSuccessMsg(`Account created for ${result.name}! Redirecting to dashboard...`);
      }

      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(result);
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      title: "Senior Sales Lead",
      name: "Alex Morgan",
      email: "executive@company.com",
      role: "Senior Sales Rep",
      badge: "Enterprise",
      color: "var(--accent-primary)"
    },
    {
      title: "Sales Director & Admin",
      name: "Sarah Connor",
      email: "admin@salesbot.ai",
      role: "Sales Director",
      badge: "Admin",
      color: "var(--accent-gold)"
    },
    {
      title: "Solutions Engineer",
      name: "David Chen",
      email: "engineer@salesbot.ai",
      role: "Solutions Lead",
      badge: "Technical",
      color: "var(--accent-emerald)"
    }
  ];

  return (
    <div className="animate-fade-in" style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '24px 16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1080px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        background: '#070f1e',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 114, 255, 0.2)',
        overflow: 'hidden'
      }}>
        
        {/* Left Side: Brand & Value Highlights */}
        <div style={{
          padding: '40px 36px',
          background: 'linear-gradient(145deg, #09152b 0%, #060b14 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '30px',
          position: 'relative'
        }}>
          {/* Top Brand Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                height: '42px',
                width: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                boxShadow: '0 0 18px rgba(0, 198, 255, 0.5)'
              }}>
                <img src="/logo.png" alt="SalesBot Logo" style={{ height: '30px', width: 'auto' }} />
              </div>
              <div>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  SalesBot <span style={{ color: '#ff9f00' }}>AI</span>
                </span>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Autonomous Sales Qualification Platform</p>
              </div>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.25, marginBottom: '14px' }}>
              Accelerate Revenue with <span style={{ background: 'linear-gradient(90deg, #38bdf8, #ff9f00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI-Powered BANT Qualification</span>
            </h1>
            
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Log in to access real-time pipeline analytics, automated lead scoring matrix, custom calendar demo booking, and live visitor chat intelligence.
            </p>
          </div>

          {/* Core Feature Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ background: 'rgba(0, 114, 255, 0.2)', padding: '8px', borderRadius: '8px' }}>
                <Zap size={18} color="#38bdf8" />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>Automated Lead Scoring</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Instant BANT analysis with 0-100 Hot/Warm classification</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ background: 'rgba(255, 159, 0, 0.2)', padding: '8px', borderRadius: '8px' }}>
                <Calendar size={18} color="#ff9f00" />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>1-Click Calendar Booking</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Automatic Zoom & Google Calendar demo link generation</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '8px', borderRadius: '8px' }}>
                <BarChart3 size={18} color="#10b981" />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>Real-time Executive Dashboard</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Full pipeline conversion metrics and audit trail</div>
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials Footer */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '18px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ff9f00', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Quick 1-Click Demo Login
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickDemoLogin(acc)}
                  disabled={isLoading}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '8px 6px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#ffffff'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = acc.color}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
                >
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {acc.name}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{acc.badge}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Login / Register Form */}
        <div style={{
          padding: '40px 36px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'center'
        }}>
          
          {/* Mode Selector Header Tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '4px',
            borderRadius: '9999px',
            marginBottom: '28px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '9999px',
                border: 'none',
                background: mode === 'login' ? 'linear-gradient(135deg, #0072ff, #00c6ff)' : 'transparent',
                color: mode === 'login' ? '#ffffff' : '#94a3b8',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '8px'
              }}
            >
              <LogIn size={16} /> Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '9999px',
                border: 'none',
                background: mode === 'register' ? 'linear-gradient(135deg, #0072ff, #00c6ff)' : 'transparent',
                color: mode === 'register' ? '#ffffff' : '#94a3b8',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '8px'
              }}
            >
              <UserPlus size={16} /> Create Account
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>
              {mode === 'login' ? 'Welcome Back to SalesBot' : 'Create Sales Executive Account'}
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
              {mode === 'login' ? 'Enter your credentials to access your sales workspace' : 'Fill in your details below to register a new account'}
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Lock size={16} /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {mode === 'register' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 40px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                    Sales Role / Title
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 40px',
                        borderRadius: '10px',
                        background: '#0c192c',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    >
                      <option value="Senior Sales Lead">Senior Sales Lead</option>
                      <option value="Account Executive">Account Executive</option>
                      <option value="Sales Director & Admin">Sales Director & Admin</option>
                      <option value="Solutions Engineer">Solutions Engineer</option>
                      <option value="SDR / Business Development">SDR / Business Development</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                Business Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="executive@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1' }}>
                  Password
                </label>
                {mode === 'login' && (
                  <span
                    onClick={() => alert('Password reset instructions sent to your email.')}
                    style={{ fontSize: '0.75rem', color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Forgot password?
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 40px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '10px',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(0, 114, 255, 0.4)',
                transition: 'all 0.2s ease',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Workspace' : 'Complete Registration'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#94a3b8',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Continue as Guest Preview
              </button>
            )}

          </form>

        </div>

      </div>
    </div>
  );
}

export default LoginPage;
