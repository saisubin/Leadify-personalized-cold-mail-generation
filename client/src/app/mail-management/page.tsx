'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Mail, Plus, Loader2, AlertCircle, Calendar, Users, ChevronRight } from 'lucide-react';
import { api, Campaign } from '@/lib/api';
import NewEventModal from '@/components/mail-management/NewEventModal';

export default function MailManagementPage() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCampaigns = async () => {
        try {
            const data = await api.getCampaigns();
            setCampaigns(data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch campaigns:', err);
            setError('Could not load campaigns.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleCampaignSuccess = (campaignId: string) => {
        fetchCampaigns();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 text-gray-400 bg-[#0a0e1a]">
                <Loader2 className="animate-spin" size={48} />
                <p>Loading your outreach campaigns...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-semibold mb-1">Mail Management</h1>
                    <p className="text-gray-500 text-sm">Browse and manage your cold mails</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg font-semibold transition-all"
                >
                    <Plus size={18} />
                    <span>New Campaign</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 flex items-center gap-3 mb-8">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-[#0f1624] rounded-2xl border border-[#1e293b]">
                    <Mail size={48} className="text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Campaigns Yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm text-center">
                        Upload your first lead list to start generating personalized AI outreach.
                    </p>
                </div>
            ) : (
                <div className="campaign-grid">
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            onClick={() => router.push(`/mail-management/${campaign.id}/review`)}
                            className="campaign-card"
                        >
                            <h3 className="campaign-name">{campaign.name}</h3>

                            <div>
                                <span className="campaign-stat-label">Mails Sent</span>
                                <span className="campaign-stat-value">{(campaign as any)._count?.leads || 0}</span>
                            </div>

                            <div className="campaign-arrow">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <NewEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCampaignSuccess}
            />
        </div>
    );
}
