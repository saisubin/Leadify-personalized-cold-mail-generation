'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Send, Mail, Reply, Ban, AlertCircle, Loader2, Plus, ChevronRight } from 'lucide-react';
import { api, Metrics } from '@/lib/api';
import NewEventModal from '@/components/mail-management/NewEventModal';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await api.getMetrics();
                setMetrics(data);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch metrics:', err);
                setError('Failed to connect to backend. Make sure the server is running.');
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleCampaignSuccess = (campaignId: string) => {
        // Redirect to the new campaign's management page
        router.push(`/mail-management?campaignId=${campaignId}`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 text-gray-400 bg-[#0a0e1a]">
                <Loader2 className="animate-spin" size={48} />
                <p className="animate-pulse">Loading Leadify Insights...</p>
            </div>
        );
    }

    if (error || !metrics) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-6 text-red-400 text-center p-8 bg-[#0a0e1a]">
                <div className="p-4 bg-red-400/10 rounded-full">
                    <AlertCircle size={48} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">System Offline</h2>
                    <p className="max-w-md text-gray-400">{error || 'Unable to connect to the Leadify engine.'}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                    Reconnect Now
                </button>
            </div>
        );
    }

    const cards = [
        { label: 'Total Mails Sent', value: metrics.totalSent, icon: Send },
        { label: 'Mails Opened', value: metrics.totalOpened, icon: Mail },
        { label: 'Mails Replied', value: metrics.totalReplied, icon: Reply },
        { label: 'Suppressed Mail ID\'s', value: metrics.totalSuppressed, icon: Ban, link: '/suppressed' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white p-12">
            <div className="mb-12">
                <h1 className="text-3xl font-semibold mb-1">Dashboard</h1>
                <p className="text-gray-500 text-sm">Overview of outreach</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-6xl">
                {cards.map((card, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon-box">
                            <card.icon size={20} />
                        </div>
                        <div className="stat-content flex-1">
                            <span className="stat-label">{card.label}</span>
                            <span className="stat-value">{card.value.toLocaleString()}</span>
                        </div>
                        {card.link && (
                            <Link href={card.link} className="flex items-center gap-1 text-xs border border-[#1e293b] px-3 py-1.5 rounded-md hover:bg-[#1e293b] transition-colors">
                                View <ChevronRight size={14} />
                            </Link>
                        )}
                    </div>
                ))}
            </div>
            {/* Modal */}
            <NewEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCampaignSuccess}
            />
        </div>
    );
}
