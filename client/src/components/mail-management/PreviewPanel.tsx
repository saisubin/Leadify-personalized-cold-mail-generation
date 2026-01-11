import React from 'react';
import { Paperclip, Send, Mail, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PreviewProps {
    email: any;
    onUpdate: (field: string, value: any) => void;
    selectedCount: number;
    onSend: () => void;
    onNavPrevious: () => void;
    onNavNext: () => void;
    canNavPrevious: boolean;
    canNavNext: boolean;
}

export default function PreviewPanel({
    email,
    onUpdate,
    selectedCount,
    onSend,
    onNavPrevious,
    onNavNext,
    canNavPrevious,
    canNavNext
}: PreviewProps) {
    if (!email) {
        return (
            <section className="email-preview-panel">
                <div className="email-content flex items-center justify-center">
                    <div className="empty-state">
                        <Mail size={64} style={{ opacity: 0.5, marginBottom: '1.5rem' }} />
                        <h3>No email selected</h3>
                        <p>Upload a CSV file or select an email from the list to preview</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="email-preview-panel">
            <div className="email-content">
                <div className="email-field">
                    <div className="field-label">From:</div>
                    <div className="field-value">{email.from}</div>
                </div>
                <div className="email-field">
                    <div className="field-label">To:</div>
                    <div className="field-value">{email.to}</div>
                </div>
                <div className="email-field">
                    <div className="field-label">Cc:</div>
                    <div className="field-value">{email.cc}</div>
                </div>
                <div className="email-field">
                    <div className="field-label">Subject:</div>
                    <div className="field-value">
                        <input
                            type="text"
                            value={email.subject}
                            onChange={(e) => onUpdate('subject', e.target.value)}
                        />
                    </div>
                </div>
                <div className="email-field">
                    <div className="field-label">Body:</div>
                    <div className="field-value">
                        <textarea
                            value={email.body}
                            onChange={(e) => onUpdate('body', e.target.value)}
                        />
                    </div>
                </div>
                <div className="email-field">
                    <div className="field-label">Attachments:</div>
                    <div className="field-value">
                        <div className="attachments">
                            {email.attachments && email.attachments.map((att: string, index: number) => (
                                <div key={index} className="attachment-tag">
                                    <Paperclip size={14} />
                                    {att}
                                    <button className="remove-attachment">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="navigation-controls">
                <button
                    className="nav-btn"
                    onClick={onNavPrevious}
                    disabled={!canNavPrevious}
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    className="nav-btn"
                    onClick={onNavNext}
                    disabled={!canNavNext}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </section>
    );
}
