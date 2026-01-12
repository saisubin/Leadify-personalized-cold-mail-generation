'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Paperclip, Send, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Sidebar from '@/components/mail-management/Sidebar';
import PreviewPanel from '@/components/mail-management/PreviewPanel';
import { api } from '@/lib/api';
import Toast from '@/components/common/Toast';

export default function CampaignReviewPage() {
    const params = useParams();
    const campaignId = params.eventId as string;

    const [campaign, setCampaign] = useState<any>(null);
    const [leads, setLeads] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' as 'success' | 'error' | '', isVisible: false });

    const fetchCampaignData = async () => {
        try {
            const data = await api.getCampaignDetails(campaignId);
            setCampaign(data);
            setLeads(data.leads || []);

            // Map email structure for components
            const formattedLeads = (data.leads || []).map((l: any) => ({
                id: l.id,
                to: l.mailid,
                subject: l.emailContent?.subject || 'No Subject Generated',
                body: l.emailContent?.body || 'No Content Generated',
                status: l.status,
                lead: l
            }));
            setLeads(formattedLeads);

            // Select all by default
            if (selectedIds.size === 0) {
                const allIds = new Set(formattedLeads.map((_: any, i: number) => i)) as Set<number>;
                setSelectedIds(allIds);
            }
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch campaign:', err);
            setError('Failed to load campaign data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaignData();
        // Polling for status updates (AI generation progress)
        const interval = setInterval(fetchCampaignData, 5000);
        return () => clearInterval(interval);
    }, [campaignId]);

    const filteredLeads = leads.filter(l =>
        l.to.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type, isVisible: true });
    };

    const handleToggleSelect = (index: number) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedIds(newSelected);
    };

    const handleToggleSelectAll = () => {
        if (selectedIds.size === leads.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(leads.map((_, i) => i)));
        }
    };

    const handleSend = async () => {
        const selectedIndices = Array.from(selectedIds);
        if (selectedIndices.length === 0) return;

        setIsSending(true);
        showToast(`Starting delivery for ${selectedIndices.length} emails...`, 'success');

        let successCount = 0;
        let failCount = 0;

        for (const index of selectedIndices) {
            const lead = leads[index];
            try {
                const response = await fetch(`${api.API_BASE_URL}/api/send-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: lead.to,
                        subject: lead.subject,
                        body: lead.body,
                        leadId: lead.id
                    })
                });

                if (response.ok) successCount++;
                else failCount++;
            } catch (err) {
                failCount++;
            }
        }

        setIsSending(false);
        showToast(`Sent ${successCount} emails. ${failCount} failed.`, failCount > 0 ? 'error' : 'success');
        fetchCampaignData();
    };

    if (loading && !campaign) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 text-gray-400 bg-[#0a0e1a]">
                <Loader2 className="animate-spin" size={48} />
                <p>Retrieving campaign leads...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 text-red-400 bg-[#0a0e1a]">
                <AlertCircle size={48} />
                <p>{error}</p>
                <button onClick={fetchCampaignData} className="px-4 py-2 bg-blue-600 text-white rounded-md">Retry</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#0a0e1a]">
            {/* Nav Header */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-[#1e293b] bg-[#0a0e1a]">
                <div className="flex items-center gap-2 text-sm">
                    <Link href="/mail-management" className="text-gray-500 hover:text-white transition-colors">
                        Mail Management
                    </Link>
                    <ChevronRight className="text-gray-600" size={14} />
                    <span className="text-white font-semibold">{campaign?.name}</span>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-6 py-2 border border-[#1e293b] text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-[#1e293b] transition-all">
                        <Paperclip size={18} />
                        Attach
                    </button>
                    <button
                        className="px-6 py-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white rounded-lg font-semibold flex items-center gap-2 transition-all"
                        onClick={handleSend}
                        disabled={selectedIds.size === 0 || isSending}
                    >
                        {isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        Send {selectedIds.size} Emails
                    </button>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden">
                <Sidebar
                    emails={filteredLeads}
                    selectedIndex={currentIndex}
                    onSelect={setCurrentIndex}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                <div className="flex-1 bg-[#0a0e1a] overflow-hidden">
                    {leads.length > 0 ? (
                        <PreviewPanel
                            email={leads[currentIndex]}
                            onUpdate={() => { }} // We'll implement direct DB update later
                            selectedCount={selectedIds.size}
                            onSend={handleSend} // Single send not implemented in UI yet
                            onNavPrevious={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : leads.length - 1)}
                            onNavNext={() => setCurrentIndex(prev => prev < leads.length - 1 ? prev + 1 : 0)}
                            canNavPrevious={leads.length > 1}
                            canNavNext={leads.length > 1}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600">
                            <Loader2 size={48} className="animate-spin mb-4 opacity-20" />
                            <p>Waiting for AI to generate content...</p>
                        </div>
                    )}
                </div>
            </main>

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onHide={() => setToast({ ...toast, isVisible: false })}
            />
        </div>
    );
}
