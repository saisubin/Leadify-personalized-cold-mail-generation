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
        <aside className="w-[380px] border-r border-[#1e293b] flex flex-col bg-[#0a0e1a]">
            <div className="p-6">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        className="w-full bg-[#0f172a] border border-[#1e293b] rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                        placeholder="Search email ids"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <button
                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors mb-4"
                    onClick={onToggleSelectAll}
                >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${allSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-600'}`}>
                        {allSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                    <span>{allSelected ? 'Deselect all' : 'Select all'}</span>
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
