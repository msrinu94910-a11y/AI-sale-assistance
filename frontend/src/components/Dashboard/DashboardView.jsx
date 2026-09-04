import React from 'react';
import { 
  Users, 
  Flame, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Sparkles 
} from 'lucide-react';

export function DashboardView({ summary, leads, setActiveTab, onOpenLeadModal, onOpenMeetingModal, onSelectLead }) {
  const sortedLeads = [...(leads || [])].sort((a, b) => (b.score || 0) - (a.score || 0));

  const stats = [
    {
      title: 'Total Active Leads',
      value: summary?.total_leads || 42,
      change: '+14.2% this week',
      icon: Users,
      color: '#0072ff',
      bgColor: '#e6f0ff'
    },
    {
      title: 'Hot Leads (Score 71+)',
      value: summary?.hot_leads || 18,
      change: 'High conversion intent',
      icon: Flame,
      color: '#ff3b30',
      bgColor: '#ffe5e5'
    },
    {
      title: 'Lead Conversion Rate',
      value: `${summary?.conversion_rate || 42.8}%`,
      change: '+5.4% vs last month',
      icon: TrendingUp,
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      title: 'Demos & Meetings',
      value: summary?.meetings_scheduled || 14,
      change: '4 upcoming today',
      icon: Calendar,
      color: '#ff9f00',
      bgColor: '#fff3d6'
    },
    {
      title: 'Pipeline Revenue Value',
      value: `$${((summary?.pipeline_value || 145000) / 1000).toFixed(1)}k`,
      change: 'Weighted pipeline',
      icon: DollarSign,
      color: '#8b5cf6',
      bgColor: '#f3e8ff'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner styled with SalesBot Logo Navy & Gold */}
      <div className="glass-panel" style={{ 
        padding: '28px', 
        background: 'linear-gradient(135deg, #0c192c 0%, #152a4a 100%)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(0, 114, 255, 0.3)',
        boxShadow: '0 10px 30px rgba(12, 25, 44, 0.4)'
      }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-gold">
                <Sparkles size={14} /> Sales Intelligence Active
              </span>
              <span style={{ fontSize: '0.8rem', color: '#9fb3c8' }}>Updated 2 minutes ago</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', color: '#ffffff', marginBottom: '6px' }}>
              Sales Pipeline & Lead Intelligence Dashboard
            </h1>
            <p style={{ color: '#bcccdc', maxWidth: '650px', fontSize: '0.95rem' }}>
              Real-time BANT lead qualification, pipeline velocity metrics, and automated demo scheduling.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('leads')}>
              <Users size={18} />
              <span>View All Leads</span>
            </button>
            <button className="btn btn-gold" onClick={onOpenLeadModal}>
              <span>+ Add New Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{stat.title}</span>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: stat.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={stat.color} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: stat.color, fontWeight: '700', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpRight size={14} />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid (Recent Leads & Activity Stream) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Top Hot Leads Section */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>High Priority Qualified Leads</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Ranked by AI BANT Lead Score</p>
            </div>
            <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => setActiveTab('leads')}>
              View All Leads ({leads?.length || 4})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sortedLeads.slice(0, 5).map((lead) => (
              <div 
                key={lead.id} 
                onClick={() => onSelectLead && onSelectLead(lead)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e1e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: lead.category === 'Hot' ? 'var(--status-hot-bg)' : lead.category === 'Warm' ? 'var(--status-warm-bg)' : 'var(--status-cold-bg)',
                    border: `2px solid ${lead.category === 'Hot' ? 'var(--status-hot)' : lead.category === 'Warm' ? 'var(--status-warm)' : 'var(--status-cold)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    color: lead.category === 'Hot' ? 'var(--status-hot)' : lead.category === 'Warm' ? 'var(--status-warm)' : 'var(--status-cold)',
                    fontSize: '0.95rem'
                  }}>
                    {lead.score}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>{lead.name}</h4>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{lead.company} • {lead.email}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <span className={`badge badge-${lead.category.toLowerCase()}`} style={{ 
                    padding: '7px 18px', 
                    fontSize: '0.82rem', 
                    minWidth: '210px', 
                    justifyContent: 'center', 
                    textAlign: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                  }}>
                    {lead.category} ({lead.score} PTS) • {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity & AI Insights Stream */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#0072ff" />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>Live AI Insights</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {summary?.recent_activities?.map((act, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#e6f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={16} color="#0072ff" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>{act.action}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Clock size={10} /> {act.time}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{act.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ padding: '14px', background: '#fff3d6', borderRadius: '12px', border: '1px solid #ffe099' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#b36b00', marginBottom: '4px' }}>💡 AI Recommendation</div>
              <p style={{ fontSize: '0.78rem', color: '#804d00' }}>
                3 warm leads are ready for demo scheduling. Trigger the AI follow-up assistant to increase conversion velocity.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
