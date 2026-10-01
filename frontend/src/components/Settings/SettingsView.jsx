import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, UploadCloud, Trash2, FileText, CheckCircle, AlertCircle, Bot, ArrowLeft } from 'lucide-react';
import { apiService } from '../../services/api';

export function SettingsView({ currentUser, onBack }) {
  const [settings, setSettings] = useState({ personality: 'Professional', custom_instructions: '' });
  const [documents, setDocuments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    loadSettings();
    loadDocuments();
  }, []);

  // Poll for document status if any document is "Processing"
  useEffect(() => {
    const hasProcessing = documents.some(doc => doc.status === 'Processing');
    let intervalId;
    if (hasProcessing) {
      intervalId = setInterval(() => {
        loadDocuments();
      }, 2000); // Poll every 2 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [documents]);

  const loadSettings = async () => {
    try {
      const data = await apiService.getBotSettings();
      setSettings(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadDocuments = async () => {
    try {
      const data = await apiService.getKnowledgeDocuments();
      setDocuments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await apiService.updateBotSettings(settings);
      setStatusMessage({ type: 'success', text: 'Settings saved successfully.' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Failed to save settings.' });
    }
    setIsSaving(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setStatusMessage({ type: 'error', text: 'Only PDF files are supported.' });
      return;
    }

    setIsUploading(true);
    try {
      await apiService.uploadKnowledgeDocument(file);
      await loadDocuments();
      setStatusMessage({ type: 'success', text: 'Document processed & added to Knowledge Base.' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e) {
      setStatusMessage({ type: 'error', text: `Failed to upload document: ${e.message}` });
    }
    setIsUploading(false);
    e.target.value = null; // reset
  };

  const handleDeleteDocument = async (id) => {
    try {
      await apiService.deleteKnowledgeDocument(id);
      await loadDocuments();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
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
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '12px', borderRadius: '12px', color: '#fff' }}>
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>Bot Settings & Knowledge Base</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>
            Customize the AI assistant's personality and train it on your specific properties and rules.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div style={{
          padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px',
          background: statusMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: statusMessage.type === 'success' ? '#166534' : '#991b1b'
        }}>
          {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {statusMessage.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Personality & Prompt Card */}
        <div className="card" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={20} color="#0072ff" />
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>AI Personality</h2>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Core Personality</label>
              <select 
                className="input-field"
                value={settings.personality}
                onChange={e => setSettings({...settings, personality: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="Professional">Professional & Courteous</option>
                <option value="Friendly">Friendly & Enthusiastic</option>
                <option value="Urgent">Aggressive Sales / Urgent</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Custom System Instructions</label>
              <textarea 
                className="input-field"
                value={settings.custom_instructions || ''}
                onChange={e => setSettings({...settings, custom_instructions: e.target.value})}
                placeholder="e.g., 'Always mention our current 5% discount offer for new buyers.'"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '120px', resize: 'vertical' }}
              />
              <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>These instructions are injected directly into the LLM system prompt.</p>
            </div>
            <button 
              onClick={handleSaveSettings} 
              disabled={isSaving}
              className="btn btn-primary"
              style={{ alignSelf: 'flex-start', marginTop: '8px' }}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Knowledge Base (RAG) Card */}
        <div className="card" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#0072ff" />
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Knowledge Base (RAG)</h2>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Upload Area */}
            <div style={{
              border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '32px 24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
              background: '#f8fafc', transition: 'all 0.2s', position: 'relative'
            }}>
              <UploadCloud size={32} color="#64748b" />
              <div style={{ textAlign: 'center' }}>
                <strong style={{ display: 'block', color: '#0f172a', marginBottom: '4px' }}>Upload PDF Document</strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Floorplans, HOA Rules, Brochures</span>
              </div>
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  opacity: 0, cursor: 'pointer'
                }}
              />
              {isUploading && <span style={{ color: '#0072ff', fontSize: '0.9rem', fontWeight: 'bold' }}>Processing AI Embeddings...</span>}
            </div>

            {/* Document List */}
            <div>
              <h3 style={{ fontSize: '1rem', color: '#334155', marginBottom: '12px' }}>Active Documents</h3>
              {documents.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>No documents uploaded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {documents.map(doc => (
                    <div key={doc.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 16px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                        <FileText size={18} color="#64748b" />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: '500', color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{doc.filename}</div>
                          <div style={{ fontSize: '0.75rem', color: doc.status === 'Processed' ? '#10b981' : '#f59e0b' }}>{doc.status}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteDocument(doc.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        title="Delete Document"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
