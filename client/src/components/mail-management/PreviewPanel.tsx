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
        <section className="flex-1 overflow-y-auto bg-[#0a0e1a] p-12">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center py-3 border-b border-[#1e293b]">
                    <span className="text-sm text-gray-500">From:</span>
                    <span className="text-sm text-white">{email.from}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center py-3 border-b border-[#1e293b]">
                    <span className="text-sm text-gray-500">To:</span>
                    <span className="text-sm text-white">{email.to}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center py-3 border-b border-[#1e293b]">
                    <span className="text-sm text-gray-500">Cc:</span>
                    <span className="text-sm text-white">{email.cc}</span>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center py-3">
                    <span className="text-sm text-gray-500">Subject:</span>
                    <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-3 text-sm text-white">
                        {email.subject}
                    </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] py-3">
                    <span className="text-sm text-gray-500 mt-3">Body:</span>
                    <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6 text-sm text-white leading-relaxed min-h-[400px]">
                        {email.body}
                    </div>
                </div>

                <div className="pt-6">
                    <span className="text-xs text-gray-500 mb-3 block">Attachments:</span>
                    <div className="flex flex-wrap gap-3">
                        {email.attachments && email.attachments.map((att: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 bg-[#0f172a] border border-[#1e293b] rounded p-2 text-xs text-white">
                                <Paperclip size={14} />
                                <span>{att}</span>
                                <X size={14} className="text-red-500 cursor-pointer" />
                            </div>
                        ))}
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
