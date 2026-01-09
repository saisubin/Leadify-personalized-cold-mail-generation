'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/mail-management/EventCard';
import NewEventModal from '@/components/mail-management/NewEventModal';

// Mock events data
const MOCK_EVENTS = [
    { id: '1', name: 'Event 1', mailsSent: 12450 },
    { id: '2', name: 'Event 2', mailsSent: 12450 },
    { id: '3', name: 'Event 3', mailsSent: 12450 },
    { id: '4', name: 'Event 4', mailsSent: 12450 },
    { id: '5', name: 'Event 4', mailsSent: 12450 },
    { id: '6', name: 'Event 4', mailsSent: 12450 },
    { id: '7', name: 'Event 4', mailsSent: 12450 },
    { id: '8', name: 'Event 4', mailsSent: 12450 },
];

export default function MailManagementPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState<typeof MOCK_EVENTS>([]);

    // Load events from localStorage on mount
    React.useEffect(() => {
        const storedEvents = localStorage.getItem('mail-events');
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        } else {
            // Initialize with mock events if no stored events
            setEvents(MOCK_EVENTS);
            localStorage.setItem('mail-events', JSON.stringify(MOCK_EVENTS));
        }
    }, []);

    const handleCreateEvent = (eventName: string, context: string, file: File) => {
        // Create new event
        const newEvent = {
            id: `event-${Date.now()}`,
            name: eventName,
            mailsSent: 0
        };

        const updatedEvents = [...events, newEvent];
        setEvents(updatedEvents);

        // Persist to localStorage
        localStorage.setItem('mail-events', JSON.stringify(updatedEvents));

        setIsModalOpen(false);

        // Navigate to review page
        router.push(`/mail-management/${newEvent.id}/review`);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mail Management</h1>
                    <p className="page-subtitle">Browse and manage your cold mails</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    + New Event
                </button>
            </div>

            <div className="events-grid">
                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        id={event.id}
                        name={event.name}
                        mailsSent={event.mailsSent}
                    />
                ))}
            </div>

            <NewEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateEvent={handleCreateEvent}
            />
        </div>
    );
}
