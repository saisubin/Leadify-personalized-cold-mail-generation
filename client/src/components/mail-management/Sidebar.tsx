import React from 'react';
import { Search } from 'lucide-react';

interface SidebarProps {
    emails: any[]; // Using any for now, will define types later
    selectedIndex: number;
    onSelect: (index: number) => void;
    selectedIds: Set<number>;
    onToggleSelect: (index: number) => void;
    onToggleSelectAll: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function Sidebar({
    emails,
    selectedIndex,
    onSelect,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    searchTerm,
    onSearchChange
}: SidebarProps) {
    const allSelected = emails.length > 0 && selectedIds.size === emails.length;

    return (
        <aside className="email-list-sidebar">
            <div className="search-container">
                <Search className="search-icon" size={16} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search email ids"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="select-all-container">
                <button className="btn-select-all" onClick={onToggleSelectAll}>
                    <input
                        type="checkbox"
                        className="select-all-checkbox"
                        checked={allSelected}
                        readOnly
                    />
                    <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
                </button>
            </div>

            <div className="email-list">
                {emails.map((email, index) => (
                    <div
                        key={index}
                        className={`email-item ${index === selectedIndex ? 'selected' : ''}`}
                        onClick={() => onSelect(index)}
                    >
                        <input
                            type="checkbox"
                            className="email-checkbox"
                            checked={selectedIds.has(index)}
                            onChange={(e) => {
                                e.stopPropagation();
                                onToggleSelect(index);
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <span className="email-address">{email.to}</span>
                    </div>
                ))}
                {emails.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        No emails found
                    </div>
                )}
            </div>
        </aside>
    );
}
