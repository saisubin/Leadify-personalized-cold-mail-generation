'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PreviewPanel from '@/components/PreviewPanel';
import UploadModal from '@/components/UploadModal';
import Toast from '@/components/Toast';

interface Lead {
    name: string;
    company: string;
    designation: string;
    industry: string;
    email: string;
    web_url: string;
}

interface Email {
    from: string;
    to: string;
    cc: string;
    subject: string;
    body: string;
    attachments: string[];
    lead: Lead;
}

// Sample data
const SAMPLE_LEADS: Lead[] = [
    {
        name: 'Nathan Williams',
        company: 'TechCorp Solutions',
        designation: 'CEO',
        industry: 'Technology',
        email: 'nathan.williams@techcorp.com',
        web_url: 'https://techcorp.com'
    },
    {
        name: 'Sarah Johnson',
        company: 'InnovateLabs',
        designation: 'CTO',
        industry: 'Software Development',
        email: 'sarah.johnson@innovatelabs.com',
        web_url: 'https://innovatelabs.com'
    },
    {
        name: 'Michael Chen',
        company: 'DataDrive Analytics',
        designation: 'VP Sales',
        industry: 'Data Analytics',
        email: 'michael.chen@datadrive.io',
        web_url: 'https://datadrive.io'
    },
    {
        name: 'Emily Rodriguez',
        company: 'CloudScale Inc',
        designation: 'Director of Operations',
        industry: 'Cloud Services',
        email: 'emily.rodriguez@cloudscale.com',
        web_url: 'https://cloudscale.com'
    },
    {
        name: 'David Kim',
        company: 'AIVentures',
        designation: 'Founder & CEO',
        industry: 'Artificial Intelligence',
        email: 'david.kim@aiventures.ai',
        web_url: 'https://aiventures.ai'
    },
    {
        name: 'Jessica Martinez',
        company: 'FinTech Pro',
        designation: 'Head of Product',
        industry: 'Financial Technology',
        email: 'jessica.martinez@fintechpro.com',
        web_url: 'https://fintechpro.com'
    },
    {
        name: 'Robert Taylor',
        company: 'CyberGuard Systems',
        designation: 'VP Engineering',
        industry: 'Cybersecurity',
        email: 'robert.taylor@cyberguard.io',
        web_url: 'https://cyberguard.io'
    },
    {
        name: 'Amanda White',
        company: 'HealthTech Solutions',
        designation: 'Chief Medical Officer',
        industry: 'Healthcare Technology',
        email: 'amanda.white@healthtech.com',
        web_url: 'https://healthtech.com'
    }
];

function generateSubject(lead: Lead): string {
    const subjects = [
        `Exciting opportunity for ${lead.company}`,
        `Transform ${lead.company}'s ${lead.industry} operations`,
        `${lead.name}, let's discuss ${lead.company}'s growth`,
        `Innovative solutions for ${lead.company}`,
        `Partnership opportunity for ${lead.company}`
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
}

function generateEmailBody(lead: Lead): string {
    return `Hello ${lead.name},

I hope this email finds you well. I came across ${lead.company} and was impressed by your work in the ${lead.industry} industry.

As ${lead.designation}, I believe you'd be interested in exploring how we can help ${lead.company} achieve its goals through our innovative solutions.

I noticed your website (${lead.web_url}) and think there's a great opportunity for collaboration. Our platform has helped similar companies in ${lead.industry} increase efficiency by 40% and reduce costs significantly.

Would you be open to a brief 15-minute call next week to discuss how we can add value to ${lead.company}?

Looking forward to connecting!

Best regards,
Your Name
Your Company`;
}

function generateEmails(leads: Lead[]): Email[] {
    return leads.map(lead => ({
        from: 'frommailid@gmail.com',
        to: lead.email,
        cc: 'ccmailid@gmail.com',
        subject: generateSubject(lead),
        body: generateEmailBody(lead),
        attachments: ['Sample.pdf', 'Sample.pdf'],
        lead
    }));
}

export default function Home() {
    const [emails, setEmails] = useState<Email[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [toast, setToast] = useState({ message: '', type: '' as 'success' | 'error' | '', isVisible: false });

    // Load sample data on mount
    useEffect(() => {
        const sampleEmails = generateEmails(SAMPLE_LEADS);
        setEmails(sampleEmails);
        // Select all by default
        const allIds = new Set(sampleEmails.map((_, i) => i));
        setSelectedIds(allIds);
    }, []);

    const filteredEmails = emails.filter(email =>
        email.to.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type, isVisible: true });
    };

    const handleFileSelect = (file: File) => {
        if (!file.name.endsWith('.csv')) {
            showToast('Please upload a CSV file', 'error');
            return;
        }

        setIsProcessing(true);
        setProgress(0);

        // Simulate progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 50);

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                clearInterval(interval);
                setProgress(100);

                const leads = results.data as Lead[];
                const validLeads = leads.filter(lead =>
                    lead.email && lead.name && lead.company
                );

                if (validLeads.length === 0) {
                    showToast('No valid leads found in CSV', 'error');
                    setIsModalOpen(false);
                    setIsProcessing(false);
                    return;
                }

                const newEmails = generateEmails(validLeads);
                setEmails(newEmails);
                setSelectedIds(new Set(newEmails.map((_, i) => i)));
                setCurrentIndex(0);

                setTimeout(() => {
                    setIsModalOpen(false);
                    setIsProcessing(false);
                    setProgress(0);
                    showToast(`Successfully generated ${newEmails.length} emails!`, 'success');
                }, 500);
            },
            error: () => {
                clearInterval(interval);
                showToast('Error reading file', 'error');
                setIsModalOpen(false);
                setIsProcessing(false);
            }
        });
    };

    const handleEmailUpdate = (field: string, value: any) => {
        const updatedEmails = [...emails];
        updatedEmails[currentIndex] = {
            ...updatedEmails[currentIndex],
            [field]: value
        };
        setEmails(updatedEmails);
    };

    const handleToggleSelect = (index: number) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedIds(newSelected);
    };

    const handleToggleSelectAll = () => {
        if (selectedIds.size === emails.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(emails.map((_, i) => i)));
        }
    };

    const handleNavPrevious = () => {
        if (emails.length === 0) return;
        setCurrentIndex(prev => prev === 0 ? emails.length - 1 : prev - 1);
    };

    const handleNavNext = () => {
        if (emails.length === 0) return;
        setCurrentIndex(prev => prev === emails.length - 1 ? 0 : prev + 1);
    };

    const handleSend = () => {
        if (selectedIds.size === 0) {
            showToast('Please select at least one email to send', 'error');
            return;
        }
        showToast(`Sending ${selectedIds.size} emails...`, 'success');
        setTimeout(() => {
            showToast(`Successfully sent ${selectedIds.size} emails!`, 'success');
            setSelectedIds(new Set());
        }, 2000);
    };

    return (
        <div className="app-container">
            <Header onUploadClick={() => setIsModalOpen(true)} />

            <main className="main-content">
                <Sidebar
                    emails={filteredEmails}
                    selectedIndex={currentIndex}
                    onSelect={setCurrentIndex}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                <PreviewPanel
                    email={emails[currentIndex]}
                    onUpdate={handleEmailUpdate}
                    selectedCount={selectedIds.size}
                    onSend={handleSend}
                    onNavPrevious={handleNavPrevious}
                    onNavNext={handleNavNext}
                    canNavPrevious={emails.length > 0}
                    canNavNext={emails.length > 0}
                />
            </main>

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onFileSelect={handleFileSelect}
                isProcessing={isProcessing}
                progress={progress}
            />

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onHide={() => setToast({ ...toast, isVisible: false })}
            />
        </div>
    );
}
