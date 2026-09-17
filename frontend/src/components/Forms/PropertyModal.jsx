import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, IndianRupee, Layers, Check, Info } from 'lucide-react';

export function PropertyModal({ isOpen, onClose, onSubmit, propertyToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    property_type: 'Apartment',
    bhk: '',
    price: '',
    area: '',
    amenities: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (propertyToEdit) {
        setFormData({
          name: propertyToEdit.name || '',
          description: propertyToEdit.description || '',
          location: propertyToEdit.location || '',
          property_type: propertyToEdit.property_type || 'Apartment',
          bhk: propertyToEdit.bhk || '',
          price: propertyToEdit.price || '',
          area: propertyToEdit.area || '',
          amenities: propertyToEdit.amenities || ''
        });
      } else {
        setFormData({
          name: '',
          description: '',
          location: '',
          property_type: 'Apartment',
          bhk: '',
          price: '',
          area: '',
          amenities: ''
        });
      }
      setIsSubmitting(false);
    }
  }, [isOpen, propertyToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Parse numeric fields safely
    const payload = {
      ...formData,
      bhk: formData.bhk ? parseInt(formData.bhk, 10) : null,
      price: formData.price ? parseFloat(formData.price) : null,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Error submitting property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px', width: '100%' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0072ff, #00c6ff)', padding: '8px', borderRadius: '8px' }}>
              <Building2 size={20} color="#fff" />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {propertyToEdit ? 'Edit Property Listing' : 'Add New Property Listing'}
            </h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '24px' }}>
          <form id="property-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Property Name / Title *</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Green Valley Villas"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                  placeholder="Enter a compelling description for this property..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MapPin size={14} style={{ marginRight: '4px' }} />
                  Location / Area *
                </label>
                <input
                  required
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Gachibowli, Hyderabad"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Apartment">Apartment / Flat</option>
                  <option value="Villa">Villa / House</option>
                  <option value="Plot">Plot / Land</option>
                  <option value="Commercial">Commercial Space</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Layers size={14} style={{ marginRight: '4px' }} />
                  BHK (Leave blank if Plot)
                </label>
                <input
                  type="number"
                  name="bhk"
                  value={formData.bhk}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. 3"
                  min="1"
                  max="10"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Area / Size</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. 1800 sqft or 300 sq yds"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">
                  <IndianRupee size={14} style={{ marginRight: '4px' }} />
                  Price (in ₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. 15000000 for 1.5 Cr"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Amenities (Comma separated)</label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Pool, Gym, Gated Community, Power Backup"
                />
              </div>
            </div>

            <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontSize: '0.82rem', marginTop: '4px' }}>
              <Info size={16} />
              <span>Once added, the AI Bot will instantly learn about this property and can recommend it to website visitors based on their preferences.</span>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ background: '#f8fafc', padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" form="property-form" className="btn btn-primary" disabled={isSubmitting} style={{ minWidth: '120px' }}>
            {isSubmitting ? 'Saving...' : (
              <>
                <Check size={16} />
                {propertyToEdit ? 'Save Changes' : 'Add Property'}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

export default PropertyModal;
