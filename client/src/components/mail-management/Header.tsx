import React from 'react';
import { Paperclip, Send } from 'lucide-react';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    selectedCount: number;
    onSend: () => void;
}

export default function Header({
    title = 'Mail Management',
    subtitle = "Review AI-generated emails before they're sent",
    selectedCount,
    onSend
}: HeaderProps) {
    return (
        <header className="app-header">
            <div className="header-left">
                <h1 className="app-title">{title}</h1>
                <p className="app-subtitle">{subtitle}</p>
            </div>
            <div className="header-right">
                <button className="btn-secondary" onClick={() => alert('Attachment feature coming soon!')}>
                    <Paperclip size={16} />
                    Attach
                </button>
                <button
                    className="btn-primary"
                    onClick={onSend}
                    disabled={selectedCount === 0}
                >
                    <Send size={16} />
                    Send {selectedCount} Email{selectedCount !== 1 ? 's' : ''}
                </button>
            </div>
        </header>
    );
}
