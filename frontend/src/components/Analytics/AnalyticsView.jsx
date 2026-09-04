import React from 'react';
import { BarChart3, PieChart, Target, ArrowLeft } from 'lucide-react';

export function AnalyticsView({ summary, onBack }) {
  const dist = summary?.category_distribution || { Hot: 18, Warm: 16, Cold: 8 };
  const total = (dist.Hot || 0) + (dist.Warm || 0) + (dist.Cold || 0) || 1;

  const hotPct = Math.round(((dist.Hot || 0) / total) * 100);
  const warmPct = Math.round(((dist.Warm || 0) / total) * 100);
  const coldPct = Math.round(((dist.Cold || 0) / total) * 100);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {onBack && (
            <button
              className="btn btn-secondary btn-icon"
              onClick={onBack}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              title="Back to Dashboard"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={24} color="var(--accent-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Sales Performance & Conversion Analytics</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Deep insights into lead scoring distribution, conversion velocity, and AI conversation intent analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Visual Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Lead Score Distribution Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={18} color="var(--accent-primary)" /> Lead Score Distribution
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total: {total} Leads</span>
          </div>

          {/* Visual Bar Breakdown */}
          <div style={{ display: 'flex', height: '24px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div style={{ width: `${hotPct}%`, background: 'var(--status-hot)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff', fontWeight: '800' }}>
              {hotPct}%
            </div>
            <div style={{ width: `${warmPct}%`, background: 'var(--status-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff', fontWeight: '800' }}>
              {warmPct}%
            </div>
            <div style={{ width: `${coldPct}%`, background: 'var(--status-cold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff', fontWeight: '800' }}>
              {coldPct}%
            </div>
          </div>

          {/* Category Legends */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
            <div style={{ background: 'var(--status-hot-bg)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(225, 29, 72, 0.3)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--status-hot)', fontWeight: '800' }}>🔥 Hot</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>{dist.Hot}</div>
            </div>
            <div style={{ background: 'var(--status-warm-bg)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--status-warm)', fontWeight: '800' }}>⚡ Warm</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>{dist.Warm}</div>
            </div>
            <div style={{ background: 'var(--status-cold-bg)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(37, 99, 235, 0.3)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--status-cold)', fontWeight: '800' }}>❄️ Cold</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>{dist.Cold}</div>
            </div>
          </div>
        </div>

        {/* AI Conversation Intent Funnel */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="var(--accent-purple)" /> Intent Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'BANT Qualification Inquiries', pct: 45, color: '#2563eb' },
              { label: 'Demo Scheduling Requests', pct: 30, color: '#0284c7' },
              { label: 'Pricing & Enterprise Quote Questions', pct: 15, color: '#7c3aed' },
              { label: 'General Product Inquiries', pct: 10, color: '#059669' }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>{item.label}</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{item.pct}%</strong>
                </div>
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
