import React, { useRef, useState } from 'react';
import { X, Upload } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  progress: number;
}

export default function UploadModal({
  isOpen,
  onClose,
  onFileSelect,
  isProcessing,
  progress
}: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Lead CSV</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          {!isProcessing ? (
            <div
              className={`upload-area ${dragActive ? 'bg-accent-blue-light border-accent-blue' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload size={48} style={{ margin: '0 auto', marginBottom: '1rem' }} />
              <h3>Drag & drop CSV file here</h3>
              <p>or click to browse</p>
              <p className="file-format">Expected format: name, company, designation, industry, email, web_url</p>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                hidden
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="progress-text">Processing CSV... {progress}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
