import React, { useState } from 'react';
import { Building2, Plus, Pencil, Trash2, MapPin, IndianRupee, Home, Search, Filter } from 'lucide-react';

export function PropertiesView({ properties, onOpenPropertyModal, onEditProperty, onDeleteProperty }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Format currency
  const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'All' || p.property_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={24} color="#0072ff" />
            <span>Property Inventory</span>
            <span className="badge badge-gold">{properties.length} Properties</span>
          </h2>
          <p style={{ margin: 0, marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Manage the properties your AI Bot can recommend to potential buyers.
          </p>
        </div>

        <button className="btn btn-gold" onClick={() => onOpenPropertyModal()}>
          <Plus size={16} /> Add New Property
        </button>
      </div>

      {/* Filters Panel */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', flex: 1, minWidth: '250px' }}>
          <Search size={16} color="#64748b" />
          <input 
            type="text" 
            placeholder="Search by property name or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#64748b" />
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' }}
          >
            <option value="All">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Building2 size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#334155', margin: '0 0 8px 0' }}>No Properties Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>
            {searchTerm || typeFilter !== 'All' 
              ? 'Try adjusting your filters or search terms.' 
              : 'Add your first property to let the AI start recommending it to buyers.'}
          </p>
          {!(searchTerm || typeFilter !== 'All') && (
            <button className="btn btn-primary" onClick={() => onOpenPropertyModal()}>
              <Plus size={16} /> Add Property
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredProperties.map(property => (
            <div key={property.id} className="glass-panel hover-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>{property.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
                    <MapPin size={14} /> {property.location}
                  </div>
                </div>
                <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>
                  {property.property_type}
                </div>
              </div>

              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0072ff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {formatPrice(property.price)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                  <Home size={14} color="#64748b" />
                  {property.bhk ? `${property.bhk} BHK` : 'N/A'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                  <Building2 size={14} color="#64748b" />
                  {property.area || 'Size N/A'}
                </div>
              </div>

              {property.amenities && (
                <div style={{ fontSize: '0.8rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  <strong>Amenities:</strong> {property.amenities}
                </div>
              )}

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  className="btn btn-secondary btn-icon" 
                  onClick={() => onEditProperty(property)}
                  title="Edit Property"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button 
                  className="btn btn-danger btn-icon" 
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${property.name}?`)) {
                      onDeleteProperty(property.id);
                    }
                  }}
                  title="Delete Property"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default PropertiesView;
