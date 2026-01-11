import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface EventCardProps {
    id: string;
    name: string;
    mailsSent: number;
}

export default function EventCard({ id, name, mailsSent }: EventCardProps) {
    return (
        <div className="event-card">
            <div className="event-card-content">
                <h3 className="event-card-title">{name}</h3>
                <div className="event-card-metric">
                    <span className="event-card-label">Mails Sent</span>
                    <span className="event-card-value">{mailsSent.toLocaleString()}</span>
                </div>
            </div>
            <Link href={`/mail-management/${id}`} className="event-card-arrow">
                <ArrowRight size={20} />
            </Link>
        </div>
    );
}
