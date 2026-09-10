import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  Bot, 
  Calendar, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Code, 
  Flame, 
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Mail,
  Award,
  Sliders,
  PlayCircle,
  Target,
  Cpu,
  Layers,
  Star,
  Check,
  Globe,
  Clock,
  UserCheck,
  ArrowUpRight
} from 'lucide-react';

export function LandingPage({ setActiveTab, onOpenLeadModal, onOpenEmbedModal, currentUser }) {
  // Interactive AI Console Scenarios
  const [activeScenarioKey, setActiveScenarioKey] = useState('enterprise');

  const scenarios = {
    enterprise: {
      key: 'enterprise',
      label: '🔥 Enterprise Lead ($150k+)',
      name: 'Sarah Connor',
      role: 'VP of Sales Operations',
      company: 'Cyberdyne Systems',
      score: 92,
      category: '🔥 HOT LEAD (High Intent)',
      badgeClass: 'badge-hot',
      color: '#10b981',
      userMessage: "We're looking to automate lead qualification for 50+ sales reps with a $150k ARR budget for Q3 deployment.",
      botReply: "Welcome Sarah! Based on your enterprise timeline and budget capacity, I can immediately schedule an executive demo with our Solutions Director.",
      entities: [
        { label: 'Budget', val: '$150,000 ARR', color: '#10b981' },
        { label: 'Authority', val: 'VP Decision Maker', color: '#ffd700' },
        { label: 'Timeline', val: 'Q3 Immediate', color: '#ff9f00' }
      ],
      bant: { budget: 95, need: 90, authority: 92, timeline: 90 },
      actionLog: '✅ Google Calendar Link Generated • Demo Booked Tomorrow 10:00 AM'
    },
    midmarket: {
      key: 'midmarket',
      label: '⚡ Mid-Market Buyer ($40k)',
      name: 'David Miller',
      role: 'Director of Growth',
      company: 'Apex Logistics',
      score: 68,
      category: '⚡ WARM LEAD (Nurture)',
      badgeClass: 'badge-warm',
      color: '#ff9f00',
      userMessage: "We process around 5,000 web leads monthly and want to compare pricing tiers before Q4.",
      botReply: "Hello David! SalesBot AI can easily handle your 5,000 monthly visitors. I have emailed our Mid-Market pricing matrix to your inbox.",
      entities: [
        { label: 'Budget', val: '$40,000 / yr', color: '#ff9f00' },
        { label: 'Authority', val: 'Director Level', color: '#38bdf8' },
        { label: 'Timeline', val: 'Q4 Planning', color: '#a855f7' }
      ],
      bant: { budget: 65, need: 75, authority: 70, timeline: 60 },
      actionLog: '📧 Nurture Sequence Triggered • Case Study Deck Dispatched'
    },
    cold: {
      key: 'cold',
      label: '❄️ Developer Inquiry',
      name: 'Alex Chen',
      role: 'Fullstack Engineer',
      company: 'DevStudio Labs',
      score: 35,
      category: '❄️ COLD LEAD (Self-Serve)',
      badgeClass: 'badge-cold',
      color: '#38bdf8',
      userMessage: "Just exploring your REST API endpoints and webhooks for a personal side project.",
      botReply: "Welcome Alex! You can check out our interactive API docs at /api/v1/bot/status. Let me know if you need sandbox credentials.",
      entities: [
        { label: 'Budget', val: 'Evaluation', color: '#94a3b8' },
        { label: 'Authority', val: 'Individual Dev', color: '#94a3b8' },
        { label: 'Timeline', val: 'No Urgency', color: '#94a3b8' }
      ],
      bant: { budget: 30, need: 40, authority: 35, timeline: 35 },
      actionLog: '📖 Developer Portal Documentation Link Provided'
    }
  };

  const currentScenario = scenarios[activeScenarioKey];

  // FAQ Accordion open state
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How does SalesBot AI evaluate 100% of prospect interactions?",
      a: "SalesBot AI replaces random manual chat sampling by analyzing 100% of inbound visitor conversations in real time across your website, evaluating budget capacity, authority, needs, and urgency automatically."
    },
    {
      q: "Can I customize the BANT scoring weights for my company?",
      a: "Yes! You can customize exact scoring thresholds for Budget, Authority level, Solution Need, and Timeline to reflect your company's specific ideal customer profile (ICP)."
    },
    {
      q: "How does the 1-click website embed work?",
      a: "Simply copy our single-line JavaScript snippet and paste it onto WordPress, Webflow, Shopify, React apps, or custom HTML. The intelligent AI sales assistant bubble goes live in under 60 seconds."
    },
    {
      q: "What happens when a prospect qualifies as a Hot lead?",
      a: "SalesBot AI instantly triggers automated calendar scheduling (Google Calendar/Zoom link) and syncs the prospect's qualified details directly into your lead pipeline database."
    }
  ];

  return (
    <div className="animate-fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0px', 
      paddingBottom: '0px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#1c1b18',
      background: '#FAF8F4'
    }}>
      
      {/* 🎬 1. DARK CINEMATIC HERO SECTION WITH ACCENT LIGHTING */}
      <section className="md-p-4" style={{
        position: 'relative',
        borderRadius: '24px',
        background: 'linear-gradient(180deg, #0a111e 0%, #0c182c 60%, #07101b 100%)',
        padding: '36px 32px 28px 32px',
        color: '#ffffff',
        overflow: 'hidden',
        boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        marginBottom: '24px'
      }}>
        {/* Glow Lighting Effects */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255, 207, 51, 0.22) 0%, rgba(0, 114, 255, 0.1) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(0, 198, 255, 0.18) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '840px',
          margin: '0 auto',
          gap: '16px'
        }}>
          {/* Eyebrow Pill Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: '700',
            color: '#ffd700'
          }}>
            <Sparkles size={14} color="#ffd700" />
            <span>SALESBOT AI 2.0 — AUTONOMOUS REVENUE ENGINE</span>
          </div>

          {/* Headline with Serif Italic Emphasis */}
          <h1 className="md-text-2xl" style={{
            fontSize: '2.6rem',
            fontWeight: '900',
            lineHeight: 1.15,
            color: '#ffffff',
            letterSpacing: '-0.03em'
          }}>
            Qualify Sales Prospects <br />
            <span style={{ 
              fontFamily: 'Georgia, serif', 
              fontStyle: 'italic', 
              fontWeight: '400',
              color: '#ffd700',
              background: 'linear-gradient(90deg, #ffd700 0%, #ffae00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              10x faster with Precision AI
            </span>
          </h1>

          <p style={{
            fontSize: '0.88rem',
            color: '#cbd5e1',
            lineHeight: 1.45,
            maxWidth: '520px'
          }}>
            SalesBot AI engages website visitors 24/7, evaluates BANT lead criteria, and books calendar demos automatically.
          </p>

          {/* Dual CTAs (Vibrant Yellow + Outline) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '6px' }}>
            <button
              onClick={() => setActiveTab(currentUser?.isLoggedIn ? 'dashboard' : 'login')}
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffb700 100%)',
                color: '#0a111e',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '9999px',
                fontSize: '0.94rem',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 25px rgba(255, 183, 0, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{currentUser?.isLoggedIn ? 'Launch Intelligence Workspace' : 'Get Started Free'}</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => setActiveTab(currentUser?.isLoggedIn ? 'bot' : 'login')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '12px 22px',
                borderRadius: '9999px',
                fontSize: '0.92rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Bot size={16} color="#ffd700" />
              <span>Try Interactive Bot API</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '12px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.8rem',
            color: '#94a3b8'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={15} color="#10b981" /> No Credit Card Required</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={15} color="#10b981" /> 1-Click Embed Snippet</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><ShieldCheck size={15} color="#ffd700" /> Enterprise SOC2 Security</span>
          </div>

        </div>

        {/* Hero Partner Logos Banner */}
        <div style={{
          marginTop: '28px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Trusted by revenue leaders at high-growth enterprises
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '28px', opacity: 0.85 }}>
            {['Capgemini', 'Cyberdyne Systems', 'Oura Ring', 'ActiveCampaign', 'Apex Dynamics', 'QuantumScale'].map((b, i) => (
              <span key={i} style={{ fontSize: '0.85rem', fontWeight: '800', color: '#cbd5e1', letterSpacing: '-0.01em' }}>
                ✦ {b}
              </span>
            ))}
          </div>
        </div>

      </section>

      {/* ☀️ 2. WARM CREAM SECTION: 3 KEY FEATURE CARDS WITH YELLOW BADGES */}
      <section className="md-p-4" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FFF3D6',
            color: '#b36b00',
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '800',
            marginBottom: '8px'
          }}>
            <Flame size={13} color="#ff9f00" /> REVENUE OPERATING SYSTEM
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1c1b18', letterSpacing: '-0.02em' }}>
            Review <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: '400', color: '#0072ff' }}>100% of sales interactions</span> automatically
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#64748b', marginTop: '6px' }}>
            Never miss a high-intent prospect. Replace random 2% chat sampling with full automated BANT scoring.
          </p>
        </div>

        {/* 3 Highlight Cards Grid (Warm Cream Glass with Yellow Tag Badges) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          {/* Card 1 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid #EBE5D8',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: '#FFD700',
              color: '#0c121d',
              fontWeight: '900',
              fontSize: '0.68rem',
              padding: '3px 8px',
              borderRadius: '9999px',
              letterSpacing: '0.05em'
            }}>
              NEW
            </span>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e6f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="#0072ff" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1b18' }}>
              Precision BANT Lead Scoring
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
              Evaluates Budget, Decision-Maker Authority, Business Need, and Urgency Timeline into a transparent 0-100 score matrix.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid #EBE5D8',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: '#FFD700',
              color: '#0c121d',
              fontWeight: '900',
              fontSize: '0.68rem',
              padding: '3px 8px',
              borderRadius: '9999px',
              letterSpacing: '0.05em'
            }}>
              POPULAR
            </span>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff3d6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code size={20} color="#ff9f00" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1b18' }}>
              1-Click Website Embed Bubble
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
              Copy a single line of lightweight JS to deploy the conversational AI assistant bubble on any website or app instantly.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid #EBE5D8',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: '#FFD700',
              color: '#0c121d',
              fontWeight: '900',
              fontSize: '0.68rem',
              padding: '3px 8px',
              borderRadius: '9999px',
              letterSpacing: '0.05em'
            }}>
              AUTOMATED
            </span>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1b18' }}>
              Autonomous Calendar Demos
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
              High-intent leads scoring 71+ automatically receive Google Calendar & Zoom links for seamless demo scheduling.
            </p>
          </div>

        </div>
      </section>

      {/* 🧩 3. 3x3 CAPABILITIES GRID (9 STRUCTURED CARDS) */}
      <section className="md-p-4" style={{ padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0072ff', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            PLATFORM CAPABILITIES
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1c1b18', marginTop: '4px' }}>
            All-in-One Sales Intelligence Platform
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {[
            { title: 'Real-Time Lead Scoring', desc: 'Instant 0-100 qualification rating on every inbound message.', icon: Target, bg: '#e6f0ff', color: '#0072ff' },
            { title: '1-Click Embed Snippet', desc: 'Deploy on WordPress, Webflow, Shopify, or custom HTML in 60s.', icon: Code, bg: '#fff3d6', color: '#ff9f00' },
            { title: 'AI Follow-Up Generator', desc: 'Drafts customized email sequences based on prospect pain points.', icon: Mail, bg: '#ffe5e5', color: '#ff3b30' },
            { title: 'Multi-Turn Session Memory', desc: 'Extracts name, email, company, and timeline naturally.', icon: MessageSquare, bg: '#f3e8ff', color: '#8b5cf6' },
            { title: 'High-Intent Alerting', desc: 'Flags hot enterprise opportunities immediately for sales reps.', icon: Flame, bg: '#ffe5e5', color: '#ff3b30' },
            { title: 'CRM & REST API Sync', desc: 'FastAPI endpoints (/api/v1/leads) to sync with any CRM.', icon: Layers, bg: '#e0f2fe', color: '#0369a1' },
            { title: 'Autonomous Demo Booking', desc: 'Google Calendar & Zoom link generation inside live chat.', icon: Calendar, bg: '#d1fae5', color: '#10b981' },
            { title: 'Pipeline Velocity Analytics', desc: 'Live metrics on lead volume, conversion rates, and revenue.', icon: TrendingUp, bg: '#e6f0ff', color: '#0072ff' },
            { title: 'Enterprise SOC2 Security', desc: 'Encrypted multi-tenant data storage and compliance safeguards.', icon: ShieldCheck, bg: '#fff3d6', color: '#ff9f00' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #EBE5D8',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={item.color} />
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#1c1b18' }}>{item.title}</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.45 }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🔍 4. ALTERNATING DEEP DIVE FEATURE SHOWCASES (WITH SCREEN MOCKUPS) */}
      <section className="md-p-4" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Showcase 1: Text Left, UI Mockup Right */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #EBE5D8',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="badge badge-gold" style={{ width: 'fit-content' }}>QUALIFICATION ENGINE</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1c1b18', letterSpacing: '-0.02em' }}>
              Precision BANT Matrix Lead Qualification
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55 }}>
              SalesBot AI analyzes visitor messages against your company's custom BANT parameters. Qualified prospects get scored from 0 to 100 with clear rationale.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#334155' }}><Check size={14} color="#10b981" /> Budget Allocation ($50k+ evaluation)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#334155' }}><Check size={14} color="#10b981" /> Decision-Maker Authority Level</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#334155' }}><Check size={14} color="#10b981" /> Deployment Urgency Timeline</div>
            </div>
          </div>

          {/* UI Screen Card Mockup */}
          <div style={{
            background: '#0c121d',
            borderRadius: '16px',
            padding: '18px',
            color: '#ffffff',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#ffd700' }}>🔥 HOT LEAD QUALIFIED</span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Score: 88 / 100</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '800' }}>Sarah Connor</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Cyberdyne Systems • sarah@cyberdyne.io</div>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.45, background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              ✅ Demo Booked: Tomorrow at 10:30 AM EST (Google Calendar Link Sent)
            </div>
          </div>
        </div>

      </section>

      {/* 🎛️ 5. INTERACTIVE REVENUE TELEMETRY & LIVE SALES CONSOLE (DEEP MIDNIGHT OBSIDIAN THEME) */}
      <section className="md-p-2" style={{ padding: '0 16px', marginBottom: '24px' }}>
        <div className="md-p-4" style={{
          background: 'linear-gradient(135deg, #040812 0%, #081122 50%, #03060d 100%)',
          borderRadius: '20px',
          padding: '24px 24px 20px 24px',
          color: '#ffffff',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.55)',
          border: '1px solid rgba(255, 215, 0, 0.25)'
        }}>
          
          {/* Section Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '600px', margin: '0 auto 16px auto', gap: '4px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#ffd700', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              ⚡ LIVE REVENUE TELEMETRY
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              Interactive AI Lead Qualification Console
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: 0 }}>
              Select a scenario below to watch SalesBot AI qualify prospects, extract BANT entities, and output real-time CRM actions.
            </p>
          </div>

          {/* Interactive Scenario Switcher Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {Object.values(scenarios).map((s) => {
              const isSelected = activeScenarioKey === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveScenarioKey(s.key)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.25) 0%, rgba(255, 174, 0, 0.12) 100%)' : 'rgba(255, 255, 255, 0.06)',
                    border: isSelected ? '1.5px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.16)',
                    color: isSelected ? '#ffd700' : '#ffffff',
                    padding: '7px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 16px rgba(255, 215, 0, 0.3)' : 'none'
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Dual Panel Console View */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
            
            {/* Left Panel: Simulated Live Visitor Conversation */}
            <div style={{
              background: 'rgba(10, 16, 28, 0.85)',
              borderRadius: '14px',
              padding: '18px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffffff' }}>{currentScenario.name}</span>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>({currentScenario.company})</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#ffd700', fontWeight: '800', letterSpacing: '0.05em' }}>INBOUND CHAT</span>
                </div>

                {/* Messages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Visitor Message */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', color: '#ffffff', lineHeight: 1.45 }}>
                    <span style={{ fontWeight: '800', color: '#38bdf8', fontSize: '0.74rem', display: 'block', marginBottom: '3px' }}>Prospect ({currentScenario.role}):</span>
                    "{currentScenario.userMessage}"
                  </div>

                  {/* Bot Response */}
                  <div style={{ background: 'rgba(0, 114, 255, 0.18)', border: '1px solid rgba(0, 114, 255, 0.35)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', color: '#ffffff', lineHeight: 1.45 }}>
                    <span style={{ fontWeight: '800', color: '#ffd700', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                      🤖 SalesBot AI:
                    </span>
                    "{currentScenario.botReply}"
                  </div>
                </div>
              </div>

              {/* Extracted Entity Badges */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#cbd5e1', width: '100%', marginBottom: '2px' }}>Real-Time Extracted BANT Entities:</span>
                {currentScenario.entities.map((e, idx) => (
                  <span key={idx} style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.74rem', color: e.color, fontWeight: '800', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    {e.label}: <strong style={{ color: '#ffffff' }}>{e.val}</strong>
                  </span>
                ))}
              </div>

            </div>

            {/* Right Panel: Live Telemetry BANT Scorecard */}
            <div style={{
              background: 'rgba(10, 16, 28, 0.85)',
              borderRadius: '14px',
              padding: '18px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              gap: '12px'
            }}>
              
              <div>
                {/* Score Summary Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>BANT Qualification Telemetry</span>
                  <span className={`badge ${currentScenario.badgeClass}`} style={{ fontSize: '0.74rem', padding: '4px 10px', fontWeight: '800' }}>
                    {currentScenario.category}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '2.2rem', fontWeight: '900', color: currentScenario.color, lineHeight: 1, textShadow: `0 0 12px ${currentScenario.color}40` }}>
                      {currentScenario.score} <span style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: '600' }}>/ 100</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>AI Qualification Confidence Score</span>
                  </div>

                  <button
                    onClick={() => setActiveTab(currentUser?.isLoggedIn ? 'dashboard' : 'login')}
                    style={{
                      background: 'linear-gradient(135deg, #ffd700 0%, #ffae00 100%)',
                      color: '#040812',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: '900',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(255, 174, 0, 0.35)'
                    }}
                  >
                    Open Workspace
                  </button>
                </div>

                {/* BANT Breakdown Progress Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Budget Capacity', val: currentScenario.bant.budget, color: '#10b981' },
                    { label: 'Need Alignment', val: currentScenario.bant.need, color: '#ff9f00' },
                    { label: 'Decision Authority', val: currentScenario.bant.authority, color: '#a855f7' },
                    { label: 'Urgency Timeline', val: currentScenario.bant.timeline, color: '#38bdf8' }
                  ].map((b, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#ffffff', fontWeight: '700', marginBottom: '3px' }}>
                        <span>{b.label}</span>
                        <span style={{ color: b.color, fontWeight: '800' }}>{b.val}%</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${b.val}%`, background: b.color, borderRadius: '9999px', transition: 'width 0.4s ease', boxShadow: `0 0 8px ${b.color}80` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Log Box */}
              <div style={{ background: 'rgba(16, 185, 129, 0.16)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.76rem', color: '#6ee7b7', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{currentScenario.actionLog}</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 💬 6. EXECUTIVE TESTIMONIAL QUOTE BOX */}
      <section className="md-p-4" style={{ padding: '16px 16px 24px 16px' }}>
        <div className="md-p-4" style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #EBE5D8',
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '12px'
        }}>
          <div style={{ fontSize: '2.5rem', lineHeight: 0.8, color: '#ffd700', fontFamily: 'Georgia, serif' }}>“</div>
          <p style={{ fontSize: '1.05rem', color: '#1c1b18', fontWeight: '600', lineHeight: 1.5, maxWidth: '680px' }}>
            "SalesBot AI completely transformed our inbound lead qualification. We review 100% of website visitors instantly, and our conversion to qualified demos lifted by 42.8% in the first month."
          </p>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1c1b18' }}>Marcus Vance</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>VP of Revenue Operations • Apex Dynamics</div>
          </div>
        </div>
      </section>

      {/* ❓ 7. ACCORDION FAQ SECTION */}
      <section style={{ padding: '16px 16px 28px 16px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1c1b18' }}>Frequently Asked Questions</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>Clear answers to key questions</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                style={{
                  background: '#ffffff',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  border: isOpen ? '1.5px solid #ffd700' : '1px solid #EBE5D8',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: '800', color: '#1c1b18', margin: 0 }}>
                    {faq.q}
                  </h4>
                  {isOpen ? <ChevronUp size={18} color="#b36b00" /> : <ChevronDown size={18} color="#64748b" />}
                </div>
                {isOpen && (
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '10px', lineHeight: 1.55, borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 💛 8. FULL-WIDTH VIBRANT YELLOW CLOSING CTA BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, #FFD700 0%, #FFB700 100%)',
        padding: '32px 24px',
        color: '#0c121d',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        borderRadius: '20px',
        margin: '0 16px 24px 16px',
        boxShadow: '0 12px 35px rgba(255, 183, 0, 0.3)'
      }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#0c121d', margin: 0, letterSpacing: '-0.02em' }}>
          Ready to scale your sales pipeline with AI?
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#332900', maxWidth: '580px', margin: 0, lineHeight: 1.5, fontWeight: '600' }}>
          Join market-leading CX and sales teams using SalesBot AI to score BANT leads and book demos 24/7.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '4px' }}>
          <button
            onClick={() => setActiveTab(currentUser?.isLoggedIn ? 'dashboard' : 'login')}
            style={{
              background: '#0c121d',
              color: '#ffffff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '9999px',
              fontSize: '0.94rem',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(12, 18, 29, 0.3)'
            }}
          >
            <span>{currentUser?.isLoggedIn ? 'Open Intelligence Workspace' : 'Get Started Free'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* 🖤 9. COMPREHENSIVE MULTI-COLUMN DARK FOOTER */}
      <footer style={{
        background: '#0a111e',
        color: '#ffffff',
        padding: '28px 24px 20px 24px',
        borderRadius: '20px 20px 0 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontWeight: '900', fontSize: '1.15rem', color: '#ffffff' }}>
                SalesBot <span style={{ color: '#ffd700' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Autonomous BANT Lead Qualification & Revenue Operations Platform.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffd700', marginBottom: '8px' }}>Product</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1' }}>
              <span>Precision Lead Scoring</span>
              <span>1-Click Embed Snippet</span>
              <span>Autonomous Demo Booking</span>
              <span>AI Follow-Up Email Generator</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffd700', marginBottom: '8px' }}>Solutions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1' }}>
              <span>B2B Enterprise Sales</span>
              <span>Inbound Qualification</span>
              <span>CRM & API Sync</span>
              <span>CX Team Automation</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffd700', marginBottom: '8px' }}>Company</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1' }}>
              <span>About Us</span>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>API Documentation</span>
            </div>
          </div>

        </div>

        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: '#64748b',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '14px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>© 2026 SalesBot AI Inc. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '700' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
            All Systems Operational
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
