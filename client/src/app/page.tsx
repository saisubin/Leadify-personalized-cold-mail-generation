import Link from 'next/link';
import { Send, Mail, Reply, Ban } from 'lucide-react';

export default function Dashboard() {
    // Mock data - will be replaced with real data from API/database
    const metrics = {
        totalSent: 12450,
        opened: 4234,
        replied: 2378,
        suppressed: 225
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                <p className="dashboard-subtitle">Overview of outreach</p>
            </div>

            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-icon">
                        <Send size={24} />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Total Mails Sent</p>
                        <p className="metric-value">{metrics.totalSent.toLocaleString()}</p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">
                        <Mail size={24} />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Mails Opened</p>
                        <p className="metric-value">{metrics.opened.toLocaleString()}</p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">
                        <Reply size={24} />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Mails Replied</p>
                        <p className="metric-value">{metrics.replied.toLocaleString()}</p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">
                        <Ban size={24} />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Suppressed Mail IDs</p>
                        <p className="metric-value">{metrics.suppressed}</p>
                    </div>
                    <Link href="/suppressed" className="metric-view-btn">
                        View →
                    </Link>
                </div>
            </div>
        </div>
    );
}
