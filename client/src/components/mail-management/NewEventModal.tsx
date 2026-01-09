'use client';

import React, { useRef, useState } from 'react';
import { X, Upload } from 'lucide-react';

interface NewEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateEvent: (eventName: string, context: string, file: File) => void;
}

export default function NewEventModal({
    isOpen,
    onClose,
    onCreateEvent
}: NewEventModalProps) {
    const [eventName, setEventName] = useState('');
    const [context, setContext] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState({ eventName: '', context: '', file: '' });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const isCSV = file.name.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel';

            if (isCSV) {
                setSelectedFile(file);
                setErrors(prev => ({ ...prev, file: '' }));
            } else {
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setSelectedFile(null);
                setErrors(prev => ({ ...prev, file: 'Please upload a CSV file' }));
                // Show toast notification
                setToastMessage('Invalid file type. Please upload a CSV file.');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        }
    };

    const validateForm = () => {
        const newErrors = { eventName: '', context: '', file: '' };
        let isValid = true;

        if (!eventName.trim()) {
            newErrors.eventName = 'Event name is required';
            isValid = false;
        }

        if (!context.trim()) {
            newErrors.context = 'Context is required';
            isValid = false;
        }

        if (!selectedFile) {
            newErrors.file = 'CSV file is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleCreate = () => {
        if (validateForm() && selectedFile) {
            onCreateEvent(eventName, context, selectedFile);
            // Reset form
            setEventName('');
            setContext('');
            setSelectedFile(null);
            setErrors({ eventName: '', context: '', file: '' });
        }
    };

    const handleCancel = () => {
        setEventName('');
        setContext('');
        setSelectedFile(null);
        setErrors({ eventName: '', context: '', file: '' });
        onClose();
    };

    return (
        <div className="modal active" onClick={handleCancel}>
            <div className="modal-content new-event-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2>New Event</h2>
                        <p className="modal-subtitle">Enter the required details to create a new event</p>
                    </div>
                    <button className="close-btn" onClick={handleCancel}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="eventName" className="form-label">
                            Event Name <span className="required">*</span>
                        </label>
                        <input
                            id="eventName"
                            type="text"
                            className={`form-input ${errors.eventName ? 'error' : ''}`}
                            placeholder="Enter your event name"
                            value={eventName}
                            onChange={(e) => {
                                setEventName(e.target.value);
                                setErrors(prev => ({ ...prev, eventName: '' }));
                            }}
                        />
                        {errors.eventName && <span className="error-message">{errors.eventName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="context" className="form-label">
                            Context <span className="required">*</span>
                        </label>
                        <textarea
                            id="context"
                            className={`form-textarea ${errors.context ? 'error' : ''}`}
                            placeholder="Enter your context"
                            value={context}
                            onChange={(e) => {
                                setContext(e.target.value);
                                setErrors(prev => ({ ...prev, context: '' }));
                            }}
                            rows={4}
                        />
                        {errors.context && <span className="error-message">{errors.context}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Upload CSV <span className="required">*</span>
                        </label>
                        <button
                            className="upload-csv-btn"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={16} />
                            {selectedFile ? selectedFile.name : 'Upload CSV'}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            hidden
                            onChange={handleFileSelect}
                        />
                        {errors.file && <span className="error-message">{errors.file}</span>}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handleCreate}>
                        Create
                    </button>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="toast show error">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}
