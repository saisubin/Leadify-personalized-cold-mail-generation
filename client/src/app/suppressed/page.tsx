'use client';

import React, { useEffect, useState } from 'react';
import { Ban, Loader2, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { api } from '@/lib/api';

export default function SuppressedPage() {
    // Reference data to match the screenshot exactly
    const referenceData = [
        { id: 1, mailid: 'sales.ops@initech.io', reason: 'User unsubscribed from email communications' },
        { id: 2, mailid: 'john.doe@acme.com', reason: 'Manual suppression by admin' },
        { id: 3, mailid: 'marketing@globex.com', reason: 'Hard bounce detected' },
        { id: 4, mailid: 'hr@umbrella-corp.com', reason: 'Marked as spam by recipient' },
        { id: 5, mailid: 'support@wayneenterprises.com', reason: 'Repeated soft bounces' },
        { id: 6, mailid: 'admin@starkindustries.com', reason: 'Domain reputation risk' },
        { id: 7, mailid: 'noreply@hooli.xyz', reason: 'Invalid or non-receiving address' },
        { id: 8, mailid: 'contact@wonkaindustries.com', reason: 'Compliance suppression (GDPR/Consent)' },
        { id: 9, mailid: 'ceo@soylent.co', reason: 'Blacklisted by email provider' },
        { id: 10, mailid: 'info@oscorp.com', reason: 'Temporary suppression due to rate limits' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white p-12">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2">Suppressed Mail ID's</h1>
                <p className="text-gray-500 text-sm">Email addresses that have opted out of receiving messages</p>
            </div>

            <div className="bg-[#0f1624] border border-[#1e293b] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#161e2e] border-b border-[#1e293b]">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">EMAIL ADDRESS</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">REASON</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e293b]">
                            {referenceData.map((item) => (
                                <tr key={item.id} className="hover:bg-[#1a1f2e] transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-200">
                                        {item.mailid}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {item.reason}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-[#1e293b] bg-[#0f1624] flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing 1-10 of 10 entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white border border-[#1e293b] rounded hover:bg-[#1e293b] transition-colors">
                            <ChevronLeft size={14} /> Previous
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded">
                            1
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white border border-[#1e293b] rounded hover:bg-[#1e293b] transition-colors">
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
