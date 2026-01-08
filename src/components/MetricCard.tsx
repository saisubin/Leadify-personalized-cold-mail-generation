import React from 'react';

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    isSelected: boolean;
    onClick: () => void;
}

export default function MetricCard({ icon, label, value, isSelected, onClick }: MetricCardProps) {
    return (
        <div
            className={`metric-card-tab ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <div className="metric-card-header">
                <div className="metric-icon">{icon}</div>
                <div className={`metric-radio ${isSelected ? 'selected' : ''}`}>
                    <div className="metric-radio-dot"></div>
                </div>
            </div>
            <div className="metric-content">
                <p className="metric-label">{label}</p>
                <p className="metric-value">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            </div>
        </div>
    );
}
