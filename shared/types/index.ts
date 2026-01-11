export interface Lead {
    name: string;
    company: string;
    designation: string;
    industry: string;
    email: string;
    web_url: string;
}

export interface Email {
    from: string;
    to: string;
    cc: string;
    subject: string;
    body: string;
    attachments: string[];
    lead: Lead;
}

export interface Event {
    id: string;
    name: string;
    mailsSent: number;
    createdAt?: string;
}

export type MetricType = 'sent' | 'opened' | 'replied' | 'suppressed';
