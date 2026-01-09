'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, Mail, Reply, Ban, ChevronRight } from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import Pagination from '@/components/common/Pagination';

type MetricType = 'sent' | 'opened' | 'replied' | 'suppressed';

// Mock data for different table views
const MOCK_DATA = {
    sent: [
        { mailId: 'john.doe@techcorp.com', name: 'John Doe', designation: 'CTO', company: 'TechCorp Inc', website: 'techcorp.com' },
        { mailId: 'sarah.smith@innovate.io', name: 'Sarah Smith', designation: 'VP Engineering', company: 'Innovate Solutions', website: 'innovate.io' },
        { mailId: 'michael.chen@startup.ai', name: 'Michael Chen', designation: 'Founder & CEO', company: 'Startup AI', website: 'startup.ai' },
        { mailId: 'emily.johnson@datatech.com', name: 'Emily Johnson', designation: 'Head of Product', company: 'DataTech Systems', website: 'datatech.com' },
        { mailId: 'david.williams@cloudnine.co', name: 'David Williams', designation: 'Engineering Manager', company: 'CloudNine', website: 'cloudnine.co' },
        { mailId: 'lisa.anderson@devops.io', name: 'Lisa Anderson', designation: 'DevOps Lead', company: 'DevOps Pro', website: 'devops.io' },
        { mailId: 'robert.taylor@saasify.com', name: 'Robert Taylor', designation: 'Director of IT', company: 'Saasify', website: 'saasify.com' },
        { mailId: 'jennifer.brown@techstart.net', name: 'Jennifer Brown', designation: 'Tech Lead', company: 'TechStart', website: 'techstart.net' },
        { mailId: 'james.wilson@codebase.dev', name: 'James Wilson', designation: 'Senior Developer', company: 'CodeBase Labs', website: 'codebase.dev' },
        { mailId: 'maria.garcia@webscale.io', name: 'Maria Garcia', designation: 'CTO', company: 'WebScale', website: 'webscale.io' },
    ],
    opened: [
        { mailId: 'john.doe@techcorp.com', name: 'John Doe', designation: 'CTO', company: 'TechCorp Inc', website: 'techcorp.com' },
        { mailId: 'sarah.smith@innovate.io', name: 'Sarah Smith', designation: 'VP Engineering', company: 'Innovate Solutions', website: 'innovate.io' },
        { mailId: 'emily.johnson@datatech.com', name: 'Emily Johnson', designation: 'Head of Product', company: 'DataTech Systems', website: 'datatech.com' },
        { mailId: 'lisa.anderson@devops.io', name: 'Lisa Anderson', designation: 'DevOps Lead', company: 'DevOps Pro', website: 'devops.io' },
    ],
    replied: [
        { mailId: 'john.doe@techcorp.com', name: 'John Doe', designation: 'CTO', company: 'TechCorp Inc', website: 'techcorp.com' },
        { mailId: 'sarah.smith@innovate.io', name: 'Sarah Smith', designation: 'VP Engineering', company: 'Innovate Solutions', website: 'innovate.io' },
    ],
    suppressed: [
        { mailId: 'bounced@oldcompany.com', name: 'Bounced User', designation: 'N/A', company: 'Old Company', website: 'oldcompany.com' },
        { mailId: 'unsubscribed@example.com', name: 'Unsubscribed User', designation: 'N/A', company: 'Example Corp', website: 'example.com' },
    ]
};

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
    const [selectedMetric, setSelectedMetric] = useState<MetricType>('sent');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const tableData = MOCK_DATA[selectedMetric];

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTableData = tableData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="page-container">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link href="/mail-management" className="breadcrumb-link">Mail Management</Link>
                <ChevronRight size={16} className="breadcrumb-separator" />
                <span className="breadcrumb-current">Event 1</span>
            </div>

            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Event 1</h1>
            </div>

            {/* Metric Cards */}
            <div className="event-metrics-grid">
                <MetricCard
                    icon={<Send size={24} />}
                    label="Mails Sent"
                    value={12450}
                    isSelected={selectedMetric === 'sent'}
                    onClick={() => setSelectedMetric('sent')}
                />
                <MetricCard
                    icon={<Mail size={24} />}
                    label="Mails Opened"
                    value={4234}
                    isSelected={selectedMetric === 'opened'}
                    onClick={() => setSelectedMetric('opened')}
                />
                <MetricCard
                    icon={<Reply size={24} />}
                    label="Mails Replied"
                    value={2378}
                    isSelected={selectedMetric === 'replied'}
                    onClick={() => setSelectedMetric('replied')}
                />
                <MetricCard
                    icon={<Ban size={24} />}
                    label="Suppressed Mail IDs"
                    value={225}
                    isSelected={selectedMetric === 'suppressed'}
                    onClick={() => setSelectedMetric('suppressed')}
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
                            <th>Website</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTableData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.mailId}</td>
                                <td>{row.name}</td>
                                <td>{row.designation}</td>
                                <td>{row.company}</td>
                                <td>{row.website}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    currentPage={currentPage}
                    totalItems={tableData.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}
