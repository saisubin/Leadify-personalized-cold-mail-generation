'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Send, Mail, Reply, Ban, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import Pagination from '@/components/common/Pagination';
import { api } from '@/lib/api';

type MetricType = 'sent' | 'opened' | 'replied' | 'failed' | 'pending';

export default function EventDetailPage() {
    const params = useParams();
    const eventId = params.eventId as string;

    const [selectedMetric, setSelectedMetric] = useState<MetricType>('sent');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [campaign, setCampaign] = useState<any>(null);
    const [metrics, setMetrics] = useState<any>(null);

    const itemsPerPage = 10;

    const fetchData = async () => {
        try {
            const [campaignData, metricsData] = await Promise.all([
                api.getCampaignDetails(eventId),
                api.getCampaignMetrics(eventId)
            ]);
            setCampaign(campaignData);
            setMetrics(metricsData);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch event details:', err);
            setError('Failed to load campaign data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [eventId]);

    if (loading && !campaign) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 text-gray-400 bg-[#0a0e1a]">
                <Loader2 className="animate-spin" size={48} />
                <p>Loading campaign details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 text-red-400 bg-[#0a0e1a]">
                <AlertCircle size={48} />
                <p>{error}</p>
                <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-md">Retry</button>
            </div>
        );
    }

    const leads = campaign?.leads || [];

    // Filter leads based on selected metric
    const filteredLeads = leads.filter((l: any) => {
        if (selectedMetric === 'sent') return ['SENT', 'NO_RESPONSE', 'REPLIED'].includes(l.status);
        if (selectedMetric === 'opened') return l.emailContent?.openCount > 0;
        if (selectedMetric === 'replied') return !!l.emailContent?.repliedAt;
        if (selectedMetric === 'failed') return l.status === 'FAILED';
        if (selectedMetric === 'pending') return ['PENDING', 'GENERATED'].includes(l.status);
        return true;
    });

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTableData = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="page-container">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link href="/mail-management" className="breadcrumb-link">Mail Management</Link>
                <ChevronRight size={16} className="breadcrumb-separator" />
                <span className="breadcrumb-current">{campaign?.name || 'Campaign'}</span>
            </div>

            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">{campaign?.name}</h1>
            </div>

            {/* Metric Cards */}
            <div className="event-metrics-grid">
                <MetricCard
                    icon={<Send size={24} />}
                    label="Mails Sent"
                    value={metrics?.sent || 0}
                    isSelected={selectedMetric === 'sent'}
                    onClick={() => setSelectedMetric('sent')}
                />
                <MetricCard
                    icon={<Mail size={24} />}
                    label="Mails Opened"
                    value={metrics?.opened || 0}
                    isSelected={selectedMetric === 'opened'}
                    onClick={() => setSelectedMetric('opened')}
                />
                <MetricCard
                    icon={<Reply size={24} />}
                    label="Mails Replied"
                    value={metrics?.replied || 0}
                    isSelected={selectedMetric === 'replied'}
                    onClick={() => setSelectedMetric('replied')}
                />
                <MetricCard
                    icon={<Ban size={24} />}
                    label="Failed"
                    value={metrics?.failed || 0}
                    isSelected={selectedMetric === 'failed'}
                    onClick={() => setSelectedMetric('failed')}
                />
            </div>

            {/* Dynamic Table */}
            <div className="event-table-container">
                <table className="event-table">
                    <thead>
                        <tr>
                            <th>Mail ID</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Company</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTableData.map((row: any, index: number) => (
                            <tr key={index}>
                                <td>{row.mailid}</td>
                                <td>{row.name}</td>
                                <td>{row.designation}</td>
                                <td>{row.companyName}</td>
                                <td>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'SENT' ? 'bg-green-500/10 text-green-500' :
                                            row.status === 'FAILED' ? 'bg-red-500/10 text-red-500' :
                                                'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredLeads.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                        No records found for this metric.
                    </div>
                )}

                {filteredLeads.length > itemsPerPage && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredLeads.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
}
