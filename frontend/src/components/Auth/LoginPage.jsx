import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Building, 
  LogIn,
  UserPlus
} from 'lucide-react';
import { apiService } from '../../services/api';

export function LoginPage({ onLoginSuccess, onCancel, noticeMessage }) {
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
      name: "Alex Morgan",
      email: "executive@company.com",
      badge: "Sales Rep",
      color: "#0072ff"
    },
    {
      name: "Sarah Connor",
      email: "admin@salesbot.ai",
      badge: "Admin",
      color: "#ff9f00"
    },
    {
      name: "David Chen",
      email: "engineer@salesbot.ai",
      badge: "Engineer",
      color: "#10b981"
    }
  ];

  return (
    <div className="animate-fade-in" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 16px',
      background: 'linear-gradient(135deg, #050b14 0%, #0a1628 45%, #08111e 75%, #03060c 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Subtle Dot Grid Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.35,
        pointerEvents: 'none'
      }} />

      {/* Top-Left Cyan/Blue Ambient Glow Orb */}
      <div style={{
        position: 'absolute',
        top: '-180px',
        left: '-180px',
        width: '650px',
        height: '650px',
        background: 'radial-gradient(circle, rgba(0, 198, 255, 0.22) 0%, rgba(0, 114, 255, 0.08) 50%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        pointerEvents: 'none'
      }} />

      {/* Bottom-Right Vibrant Orange Ambient Glow Orb */}
      <div style={{
        position: 'absolute',
        bottom: '-180px',
        right: '-180px',
        width: '650px',
        height: '650px',
        background: 'radial-gradient(circle, rgba(255, 94, 0, 0.18) 0%, rgba(255, 69, 0, 0.05) 50%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        pointerEvents: 'none'
      }} />

      {/* Center Spotlight */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main Dual-Panel Card */}
      <div style={{
        width: '100%',
        maxWidth: '1020px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        background: '#ffffff',
        borderRadius: '32px',
        boxShadow: '0 35px 100px -15px rgba(0, 0, 0, 0.75), 0 0 60px rgba(0, 114, 255, 0.25)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 2,
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        
        {/* Left Side: Dark Hero Graphic Showcase (Payoneer Style) */}
        <div style={{
          padding: '36px 36px 24px 36px',
          background: 'linear-gradient(160deg, #111827 0%, #070c14 100%)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div>
            {/* Top Back Button inside Left Panel */}
            {onCancel && (
              <button
                onClick={onCancel}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '20px',
                  transition: 'all 0.2s ease'
                }}
              >
                <ArrowLeft size={14} color="#ffd700" />
                <span>Back to Home</span>
              </button>
            )}

            <span style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#94a3b8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '16px'
            }}>
              Autonomous BANT Lead Qualification — online sales for you
            </span>

            <h1 style={{
              fontSize: '2.4rem',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '20px'
            }}>
              Accelerate <br />
              <span style={{
                background: 'linear-gradient(90deg, #38bdf8 0%, #ff9f00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                your revenue
              </span>
            </h1>
          </div>

          {/* Smartphone App Graphic Showcase */}
          <div style={{
            position: 'relative',
            marginTop: '10px',
            marginBottom: '10px',
            display: 'flex',
            justify: 'center',
            alignItems: 'flex-end'
          }}>
            <img
              src="/login_hero.jpg"
              alt="SalesBot AI Smartphone Dashboard"
              style={{
                width: '85%',
                maxWidth: '300px',
                height: 'auto',
                maxHeight: '340px',
                objectFit: 'cover',
                borderRadius: '24px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 114, 255, 0.3)',
                border: '3px solid rgba(255, 255, 255, 0.15)'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            fontSize: '0.72rem',
            color: '#64748b',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span>© 2026 SalesBot AI Inc.</span>
            <span>Privacy & Terms</span>
          </div>
        </div>

        {/* Right Side: Clean White Sign-In Form (Payoneer Style) */}
        <div style={{
          padding: '40px 38px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          gap: '20px'
        }}>
          
          {/* Top Header Row: Brand Logo + Sign Up Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                height: '34px',
                width: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                boxShadow: '0 4px 12px rgba(0, 114, 255, 0.3)'
              }}>
                <img src="/logo.png" alt="SalesBot Logo" style={{ height: '22px', width: 'auto' }} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
                SalesBot <span style={{ color: '#ff9f00' }}>AI</span>
              </span>
            </div>

            {/* Mode Toggle Button */}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '7px 14px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              {mode === 'login' ? (
                <>
                  <UserPlus size={14} color="#0072ff" />
                  <span>Create Account</span>
                </>
              ) : (
                <>
                  <LogIn size={14} color="#0072ff" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </div>

          {/* Form Header Title */}
          <div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px', margin: 0 }}>
              {mode === 'login' ? 'Enter your credentials to access your sales workspace' : 'Register a new sales executive account below'}
            </p>
          </div>

          {/* Feedback & Redirect Notices */}
          {noticeMessage && (
            <div style={{
              background: '#e0f2fe',
              border: '1px solid #7dd3fc',
              color: '#0369a1',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.82rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={16} /> {noticeMessage}
            </div>
          )}

          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.82rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Lock size={16} /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #6ee7b7',
              color: '#047857',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.82rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {mode === 'register' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 44px',
                        borderRadius: '9999px',
                        background: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        color: '#0f172a',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    Sales Role / Title
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 44px',
                        borderRadius: '9999px',
                        background: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        color: '#0f172a',
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
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                Email or Username
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="executive@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    borderRadius: '9999px',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155' }}>
                  Password
                </label>
                {mode === 'login' && (
                  <span
                    onClick={() => alert('Password reset instructions sent to your email.')}
                    style={{ fontSize: '0.76rem', color: '#ff5e00', cursor: 'pointer', fontWeight: '700' }}
                  >
                    Forgot password?
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 44px 12px 44px',
                    borderRadius: '9999px',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Primary Action Pill Button (Payoneer Style Gradient) */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '6px',
                padding: '14px',
                borderRadius: '9999px',
                border: 'none',
                background: 'linear-gradient(90deg, #ff4500 0%, #ff7700 100%)',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(255, 69, 0, 0.35)',
                transition: 'all 0.2s ease',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  color: '#334155',
                  padding: '11px',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  fontWeight: '800',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease'
                }}
              >
                <ArrowLeft size={16} color="#0072ff" />
                <span>Back to Landing Page</span>
              </button>
            )}

          </form>

          {/* Quick Demo Credentials Section */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#ff5e00', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Quick 1-Click Demo Login
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickDemoLogin(acc)}
                  disabled={isLoading}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '8px 4px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#0f172a'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = acc.color}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {acc.name}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: '600' }}>{acc.badge}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default LoginPage;
