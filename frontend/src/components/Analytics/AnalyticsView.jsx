import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart as PieChartIcon, Target, ArrowLeft } from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';

export function AnalyticsView({ summary, onBack }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const dist = summary?.category_distribution || { Hot: 18, Warm: 16, Cold: 8 };
  const total = (dist.Hot || 0) + (dist.Warm || 0) + (dist.Cold || 0) || 1;

  const leadData = [
    { name: 'Hot', value: dist.Hot || 0, color: '#e11d48' },
    { name: 'Warm', value: dist.Warm || 0, color: '#d97706' },
    { name: 'Cold', value: dist.Cold || 0, color: '#2563eb' }
  ];

  const intentData = [
    { name: 'Property & Location', value: 45, fill: '#3b82f6' },
    { name: 'Site Visit Booking', value: 30, fill: '#0ea5e9' },
    { name: 'Pricing & Layout', value: 15, fill: '#8b5cf6' },
    { name: 'General Amenities', value: 10, fill: '#10b981' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: 0, fontWeight: '700', fontSize: '0.85rem', color: '#0f172a' }}>{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div className="glass-card-premium" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onBack && (
            <button
              className="btn btn-secondary btn-icon"
              onClick={onBack}
              style={{ padding: '10px 16px', fontSize: '0.85rem', borderRadius: '12px', border: 'none', background: '#f1f5f9' }}
              title="Back to Dashboard"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.15)' }}>
            <BarChart3 size={26} color="#2563eb" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: '800', letterSpacing: '-0.02em' }}>Sales Performance & Analytics</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px' }}>
              Deep insights into lead scoring distribution, conversion velocity, and AI conversation intent analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Visual Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* Lead Score Distribution Card */}
        <div className="glass-card-premium" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800' }}>
              <div style={{ background: '#f0f9ff', padding: '6px', borderRadius: '8px' }}><PieChartIcon size={20} color="#0284c7" /></div>
              Lead Score Distribution
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div className="pulse-dot"></div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total: {total} Leads</span>
            </div>
          </div>

          <div style={{ height: '220px', width: '100%', position: 'relative' }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {leadData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {/* Center Label for Donut */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', lineHeight: '1' }}>{total}</span>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Leads</span>
            </div>
          </div>

          {/* Category Legends */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
            <div className="stat-card-hot" style={{ padding: '16px 12px', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: '#e11d48', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔥 Hot</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#881337', marginTop: '4px', lineHeight: '1' }}>{dist.Hot}</div>
            </div>
            <div className="stat-card-warm" style={{ padding: '16px 12px', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚡ Warm</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#78350f', marginTop: '4px', lineHeight: '1' }}>{dist.Warm}</div>
            </div>
            <div className="stat-card-cold" style={{ padding: '16px 12px', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>❄️ Cold</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1e3a8a', marginTop: '4px', lineHeight: '1' }}>{dist.Cold}</div>
            </div>
          </div>
        </div>

        {/* AI Conversation Intent Funnel */}
        <div className="glass-card-premium" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800' }}>
            <div style={{ background: '#faf5ff', padding: '6px', borderRadius: '8px' }}><Target size={20} color="#9333ea" /></div>
            Intent Breakdown
          </h3>

          <div style={{ height: '320px', width: '100%', marginTop: '10px' }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intentData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} animationDuration={1500}>
                    {intentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
