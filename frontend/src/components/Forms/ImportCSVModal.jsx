import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import apiService from '../../services/api';

export function ImportCSVModal({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setFile(null);
    setPreviewRows([]);
    setValidationErrors([]);
    setIsUploading(false);
    setSuccessMessage('');
  };

  const processCSVFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith('.csv')) {
      setValidationErrors(['Invalid file format. Please upload a .csv file.']);
      return;
    }

    setFile(selectedFile);
    setValidationErrors([]);
    setSuccessMessage('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          setValidationErrors(['CSV file appears to be empty or missing data rows.']);
          setPreviewRows([]);
          return;
        }

        const headers = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
        const parsed = [];
        const errs = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          const values = [];
          let inQuotes = false;
          let currentToken = '';
          for (let char of line) {
            if (char === '"' || char === "'") {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(currentToken.replace(/^["']|["']$/g, '').trim());
              currentToken = '';
            } else {
              currentToken += char;
            }
          }
          if (currentToken || line.endsWith(',')) {
            values.push(currentToken.replace(/^["']|["']$/g, '').trim());
          }

          const rowObj = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx] || '';
          });

          const name = rowObj['name'] || rowObj['full name'] || rowObj['lead name'];
          const email = rowObj['email'] || rowObj['email address'];
          const isValid = Boolean(name && email);

          if (!isValid) {
            errs.push(`Row ${i + 1}: Missing Name or Email (Skipped)`);
          }

          const budget = parseInt(rowObj['budget']) || 50;
          const need = parseInt(rowObj['need']) || 50;
          const authority = parseInt(rowObj['authority']) || 50;
          const timeline = parseInt(rowObj['timeline']) || 50;
          const score = Math.round(budget * 0.25 + need * 0.30 + authority * 0.20 + timeline * 0.25);
          const category = score >= 71 ? 'Hot' : score >= 41 ? 'Warm' : 'Cold';

          parsed.push({
            rowIndex: i + 1,
            name: name || '(Missing Name)',
            email: email || '(Missing Email)',
            company: rowObj['company'] || rowObj['organization'] || 'Enterprise',
            phone: rowObj['phone'] || rowObj['phone number'] || '',
            status: rowObj['status'] || 'New',
            score,
            category,
            isValid
          });
        }

        setPreviewRows(parsed);
        setValidationErrors(errs);
      } catch (err) {
        setValidationErrors(['Error reading CSV file. Please verify file encoding.']);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processCSVFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processCSVFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await apiService.importLeadsCSV(file);
      setIsUploading(false);
      if (result && result.success) {
        setSuccessMessage(`Successfully imported ${result.imported_count} leads!`);
        setTimeout(() => {
          if (onImportSuccess) onImportSuccess(result);
          handleReset();
          onClose();
        }, 1200);
      } else {
        setValidationErrors(result.errors || ['Import failed. Please try again.']);
      }
    } catch (err) {
      setIsUploading(false);
      setValidationErrors(['Error uploading CSV to server.']);
    }
  };

  const validCount = previewRows.filter((r) => r.isValid).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div
        className="glass-panel animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '680px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(0, 114, 255, 0.2)',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid rgba(0, 114, 255, 0.4)'
              }}
            >
              <FileSpreadsheet size={22} color="#60a5fa" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, color: '#ffffff' }}>
                Bulk Import Leads via CSV
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Upload prospect list to qualify & score leads automatically
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {successMessage ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <CheckCircle size={56} color="#10b981" className="animate-bounce" />
              <h4 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '700' }}>Import Complete</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem' }}>{successMessage}</p>
            </div>
          ) : !file ? (
            /* Upload Dropzone Step */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragOver ? '2px dashed #0072ff' : '2px dashed #cbd5e1',
                  background: isDragOver ? '#f0f7ff' : '#f8fafc',
                  borderRadius: '14px',
                  padding: '36px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  style={{ display: 'none' }}
                />
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: '#e0f2fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0284c7'
                  }}
                >
                  <Upload size={26} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>
                    Click to browse or drag and drop CSV file
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                    Supports standard CSV files with Name, Email, Phone, Company, Status, and BANT metrics
                  </p>
                </div>
              </div>

              {/* Download Sample Template Banner */}
              <div
                style={{
                  background: '#f1f5f9',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} color="#0072ff" />
                  <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '600' }}>
                    Need the expected CSV header format?
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => apiService.downloadSampleCSVTemplate()}
                  style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} /> Download Sample CSV
                </button>
              </div>
            </div>
          ) : (
            /* CSV Preview Step */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                    File Selected: <span style={{ color: '#0072ff' }}>{file.name}</span>
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Previewing top prospect rows and automated BANT qualification status
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  <RefreshCw size={14} /> Choose Different File
                </button>
              </div>

              {/* Status Summary Pills */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle size={14} /> {validCount} Ready to Import
                </span>
                {validationErrors.length > 0 && (
                  <span
                    style={{
                      background: '#fef2f2',
                      color: '#991b1b',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <AlertCircle size={14} /> {validationErrors.length} Warnings/Errors
                  </span>
                )}
              </div>

              {/* Validation Warning Box */}
              {validationErrors.length > 0 && (
                <div
                  style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    maxHeight: '100px',
                    overflowY: 'auto'
                  }}
                >
                  {validationErrors.map((err, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', color: '#be123c', marginBottom: '4px' }}>
                      • {err}
                    </div>
                  ))}
                </div>
              )}

              {/* Preview Table */}
              <div
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  maxHeight: '260px',
                  overflowY: 'auto'
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px' }}>Row</th>
                      <th style={{ padding: '10px 12px' }}>Name</th>
                      <th style={{ padding: '10px 12px' }}>Email</th>
                      <th style={{ padding: '10px 12px' }}>Company</th>
                      <th style={{ padding: '10px 12px' }}>BANT Score</th>
                      <th style={{ padding: '10px 12px' }}>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.slice(0, 10).map((row, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          background: row.isValid ? '#ffffff' : '#fff5f5'
                        }}
                      >
                        <td style={{ padding: '10px 12px', fontWeight: '600', color: '#64748b' }}>
                          #{row.rowIndex}
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: '700', color: row.isValid ? '#0f172a' : '#ef4444' }}>
                          {row.name}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#475569' }}>{row.email}</td>
                        <td style={{ padding: '10px 12px', color: '#64748b' }}>{row.company}</td>
                        <td style={{ padding: '10px 12px', fontWeight: '700', color: '#0072ff' }}>
                          {row.score} / 100
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className={`badge badge-${row.category.toLowerCase()}`}>
                            {row.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!successMessage && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              justify: 'flex-end',
              gap: '12px'
            }}
          >
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            {file && (
              <button
                onClick={handleConfirmImport}
                disabled={isUploading || validCount === 0}
                className="btn btn-gold"
                style={{ opacity: isUploading || validCount === 0 ? 0.6 : 1 }}
              >
                {isUploading ? (
                  <>Processing CSV...</>
                ) : (
                  <>
                    <Upload size={16} /> Confirm & Import ({validCount} Leads)
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImportCSVModal;
