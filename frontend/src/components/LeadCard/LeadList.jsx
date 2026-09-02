import React, { useState } from 'react';
import { Search, Plus, Flame, Building, Mail, Phone, UserPlus } from 'lucide-react';

export function LeadList({ leads, onSelectLead, onOpenLeadModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      filterCategory === 'All' || lead.category.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Controls Bar */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Qualified Lead Directory & Pipeline</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Track, filter, and manage all qualified prospect accounts and sales pipeline status.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search leads by name, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '9px 12px 9px 36px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                width: '250px'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '4px', background: '#eef4fc', padding: '4px', borderRadius: '10px', border: '1px solid #bcccdc' }}>
            {['All', 'Hot', 'Warm', 'Cold'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: filterCategory === cat ? '800' : '600',
                  color: filterCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  background: filterCategory === cat ? '#0072ff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <button className="btn btn-gold" onClick={onOpenLeadModal}>
            <UserPlus size={16} />
            <span>+ Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Lead Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="glass-panel"
            onClick={() => onSelectLead(lead)}
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {/* Top Row: Name & Category Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.08rem', color: 'var(--text-primary)', fontWeight: '700' }}>{lead.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  <Building size={14} />
                  <span>{lead.company || 'Private Enterprise'}</span>
                </div>
              </div>

              <span className={`badge badge-${lead.category.toLowerCase()}`}>
                <Flame size={12} /> {lead.category} ({lead.score})
              </span>
            </div>

            {/* Contact details */}
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="var(--text-muted)" />
                <span>{lead.email}</span>
              </div>
              {lead.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="var(--text-muted)" />
                  <span>{lead.phone}</span>
                </div>
              )}
            </div>

            {/* Micro-Bars */}
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                <span>Budget ({lead.budget || 50}%)</span>
                <span>Need ({lead.need || 50}%)</span>
                <span>Authority ({lead.authority || 50}%)</span>
                <span>Timeline ({lead.timeline || 50}%)</span>
              </div>
              
              {/* Overall Lead Score Bar */}
              <div style={{ width: '100%', height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${lead.score}%`,
                  height: '100%',
                  background: lead.category === 'Hot' 
                    ? 'linear-gradient(90deg, #ff3b30, #ff6b6b)' 
                    : lead.category === 'Warm' 
                    ? 'linear-gradient(90deg, #ff9f00, #ffc107)' 
                    : 'linear-gradient(90deg, #0072ff, #00c6ff)',
                  borderRadius: '4px'
                }} />
              </div>
            </div>

            {/* Bottom Row: Pipeline Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status Pipeline:</span>
              <span style={{
                color: '#0072ff',
                background: '#e6f0ff',
                padding: '4px 12px',
                borderRadius: '8px',
                fontWeight: '700',
                border: '1px solid #bfdbfe'
              }}>
                {lead.status}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
