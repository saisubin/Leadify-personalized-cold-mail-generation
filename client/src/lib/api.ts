export const API_BASE_URL = 'http://localhost:5000';

export interface Metrics {
    totalSent: number;
    totalOpened: number;
    totalReplied: number;
    totalFailed: number;
    totalSuppressed: number;
    totalNotSent: number;
}

export interface Lead {
    id: string;
    mailid: string;
    name: string | null;
    designation: string | null;
    companyName: string | null;
    status: string;
}

export interface Campaign {
    id: string;
    name: string;
    description: string | null;
    status: string;
    createdAt: string;
}

export const api = {
    API_BASE_URL,
    async getMetrics(): Promise<Metrics> {
        const response = await fetch(`${API_BASE_URL}/api/ai/metrics`);
        if (!response.ok) throw new Error('Failed to fetch metrics');
        return response.json();
    },

    async getCampaigns(): Promise<Campaign[]> {
        // We'll need to define this route in the backend soon
        const response = await fetch(`${API_BASE_URL}/api/ai/campaigns`);
        if (!response.ok) return [];
        return response.json();
    },

    async getCampaignDetails(id: string): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/ai/campaigns/${id}`);
        if (!response.ok) throw new Error('Failed to fetch campaign details');
        return response.json();
    },

    async getCampaignMetrics(id: string): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/ai/campaigns/${id}/metrics`);
        if (!response.ok) throw new Error('Failed to fetch campaign metrics');
        return response.json();
    },

    async getSuppressions(): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/api/track/suppressions`);
        if (!response.ok) throw new Error('Failed to fetch suppressions');
        return response.json();
    },

    async generateEmails(records: any[], campaignName: string) {
        const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ records, campaignName })
        });
        if (!response.ok) throw new Error('Failed to start generation');
        return response.json();
    }
};
