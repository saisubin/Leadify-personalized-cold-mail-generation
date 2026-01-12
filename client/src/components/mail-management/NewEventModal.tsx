'use client';

import React, { useRef, useState } from 'react';
import { X, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';
import { api } from '@/lib/api';

interface NewEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (campaignId: string) => void;
}

export default function NewEventModal({
    isOpen,
    onClose,
    onSuccess
}: NewEventModalProps) {
    const [campaignName, setCampaignName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState<'idle' | 'parsing' | 'uploading' | 'success'>('idle');
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.name.endsWith('.csv')) {
                setSelectedFile(file);
                setError(null);
            } else {
                setError('Please upload a valid CSV file.');
            }
        }
    };

    const handleCreate = async () => {
        if (!campaignName.trim()) {
            setError('Please enter a campaign name.');
            return;
        }
        if (!selectedFile) {
            setError('Please select a CSV file.');
            return;
        }

        setIsProcessing(true);
        setStatus('parsing');
        setError(null);

        // Parse CSV
        Papa.parse(selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    setStatus('uploading');
                    const records = results.data;

                    // Call API to start generation
                    const response = await api.generateEmails(records, campaignName);

                    setStatus('success');
                    setTimeout(() => {
                        onClose();
                        if (onSuccess) onSuccess(response.campaignId);
                        resetForm();
                    }, 1500);
                } catch (err: any) {
                    setError(err.message || 'Failed to start campaign.');
                    setIsProcessing(false);
                    setStatus('idle');
                }
            },
            error: (err) => {
                setError('Failed to parse CSV: ' + err.message);
                setIsProcessing(false);
                setStatus('idle');
            }
        });
    };

    const resetForm = () => {
        setCampaignName('');
        setSelectedFile(null);
        setIsProcessing(false);
        setStatus('idle');
        setError(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="leadify-modal">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-1">New Campaign</h2>
                    <p className="text-gray-500 text-sm">Enter the required details to create a new campaign</p>
                </div>

                {status === 'success' ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle2 size={64} className="text-green-500 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Campaign Started!</h3>
                        <p className="text-gray-400">Your leads are being processed by AI...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="form-label">Campaign Name <span>*</span></label>
                            <input
                                type="text"
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                                placeholder="Enter your campaign name"
                                className="form-input"
                                disabled={isProcessing}
                            />
                        </div>

                        <div>
                            <label className="form-label">Context <span>*</span></label>
                            <textarea
                                placeholder="Enter your context"
                                className="form-textarea"
                                disabled={isProcessing}
                            />
                        </div>

                        <div>
                            <label className="form-label">Upload CSV <span>*</span></label>
                            <button
                                onClick={() => !isProcessing && fileInputRef.current?.click()}
                                className="btn-upload"
                            >
                                <Upload size={18} />
                                <span>{selectedFile ? selectedFile.name : 'Upload CSV'}</span>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm flex items-center gap-2">
                                <X size={14} /> {error}
                            </p>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-2.5 border border-[#1e293b] text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={isProcessing}
                                className="flex-1 px-6 py-2.5 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                            >
                                {isProcessing ? (
                                    <Loader2 className="animate-spin mx-auto" size={20} />
                                ) : (
                                    'Create'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
