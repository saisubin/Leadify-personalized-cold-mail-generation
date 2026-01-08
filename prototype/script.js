// ===========================
// Application State
// ===========================
const state = {
    leads: [],
    currentEmailIndex: -1,
    selectedEmails: new Set(),
    generatedEmails: []
};

// ===========================
// DOM Elements
// ===========================
const elements = {
    newUploadBtn: document.getElementById('newUploadBtn'),
    uploadModal: document.getElementById('uploadModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    uploadArea: document.getElementById('uploadArea'),
    csvFileInput: document.getElementById('csvFileInput'),
    uploadProgress: document.getElementById('uploadProgress'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    emailList: document.getElementById('emailList'),
    emailContent: document.getElementById('emailContent'),
    searchInput: document.getElementById('searchInput'),
    sendEmailsBtn: document.getElementById('sendEmailsBtn'),
    prevEmailBtn: document.getElementById('prevEmailBtn'),
    nextEmailBtn: document.getElementById('nextEmailBtn'),
    attachBtn: document.getElementById('attachBtn'),
    selectAllBtn: document.getElementById('selectAllBtn'),
    selectAllCheckbox: document.getElementById('selectAllCheckbox'),
    selectAllText: document.getElementById('selectAllText'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// ===========================
// Event Listeners
// ===========================
function initializeEventListeners() {
    // Modal controls
    elements.newUploadBtn.addEventListener('click', () => elements.csvFileInput.click());
    elements.closeModalBtn.addEventListener('click', closeUploadModal);
    elements.uploadModal.addEventListener('click', (e) => {
        if (e.target === elements.uploadModal) closeUploadModal();
    });

    // File upload (drag-and-drop area - kept for future use if needed)
    elements.uploadArea.addEventListener('click', () => elements.csvFileInput.click());
    elements.uploadArea.addEventListener('dragover', handleDragOver);
    elements.uploadArea.addEventListener('drop', handleDrop);
    elements.csvFileInput.addEventListener('change', handleFileSelect);

    // Search
    elements.searchInput.addEventListener('input', handleSearch);

    // Navigation
    elements.prevEmailBtn.addEventListener('click', () => navigateEmail(-1));
    elements.nextEmailBtn.addEventListener('click', () => navigateEmail(1));

    // Send emails
    elements.sendEmailsBtn.addEventListener('click', handleSendEmails);

    // Attach button (placeholder)
    elements.attachBtn.addEventListener('click', () => {
        showToast('Attachment feature coming soon!', 'success');
    });

    // Select/Deselect all
    elements.selectAllBtn.addEventListener('click', toggleSelectAll);
}

// ===========================
// Modal Functions
// ===========================
function openUploadModal() {
    elements.uploadModal.classList.add('active');
}

function closeUploadModal() {
    elements.uploadModal.classList.remove('active');
    elements.uploadProgress.classList.add('hidden');
    elements.uploadArea.classList.remove('hidden');
    elements.progressFill.style.width = '0%';
}

// ===========================
// File Upload Handlers
// ===========================
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

function processFile(file) {
    if (!file.name.endsWith('.csv')) {
        showToast('Please upload a CSV file', 'error');
        return;
    }

    // Open modal and show progress
    elements.uploadModal.classList.add('active');
    elements.uploadArea.classList.add('hidden');
    elements.uploadProgress.classList.remove('hidden');

    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        parseCSV(text);
    };

    reader.onerror = function () {
        showToast('Error reading file', 'error');
        closeUploadModal();
    };

    reader.readAsText(file);
}

// ===========================
// CSV Parser
// ===========================
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    // Validate headers
    const requiredHeaders = ['name', 'company', 'designation', 'industry', 'email', 'web_url'];
    const hasAllHeaders = requiredHeaders.every(h => headers.includes(h));

    if (!hasAllHeaders) {
        showToast('CSV must contain: name, company, designation, industry, email, web_url', 'error');
        closeUploadModal();
        return;
    }

    const leads = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(',').map(v => v.trim());
        const lead = {};

        headers.forEach((header, index) => {
            lead[header] = values[index] || '';
        });

        // Validate email
        if (lead.email && validateEmail(lead.email)) {
            leads.push(lead);
        }
    }

    if (leads.length === 0) {
        showToast('No valid leads found in CSV', 'error');
        closeUploadModal();
        return;
    }

    state.leads = leads;
    simulateEmailGeneration();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===========================
// Email Generation (Simulated)
// ===========================
function simulateEmailGeneration() {
    let progress = 0;
    const totalLeads = state.leads.length;

    elements.progressText.textContent = `Generating emails for ${totalLeads} leads...`;

    const interval = setInterval(() => {
        progress += 5;
        elements.progressFill.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(interval);
            generateEmails();
        }
    }, 50);
}

function generateEmails() {
    state.generatedEmails = state.leads.map(lead => ({
        from: 'frommailid@gmail.com',
        to: lead.email,
        cc: 'ccmailid@gmail.com',
        subject: generateSubject(lead),
        body: generateEmailBody(lead),
        attachments: ['Sample.pdf', 'Sample.pdf'],
        lead: lead
    }));

    closeUploadModal();
    renderEmailList();
    showToast(`Successfully generated ${state.generatedEmails.length} emails!`, 'success');

    // Auto-select first email
    if (state.generatedEmails.length > 0) {
        selectEmail(0);
    }
}

function generateSubject(lead) {
    const subjects = [
        `Exciting opportunity for ${lead.company}`,
        `Transform ${lead.company}'s ${lead.industry} operations`,
        `${lead.name}, let's discuss ${lead.company}'s growth`,
        `Innovative solutions for ${lead.company}`,
        `Partnership opportunity for ${lead.company}`
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
}

function generateEmailBody(lead) {
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

// ===========================
// Email List Rendering
// ===========================
function renderEmailList() {
    elements.emailList.innerHTML = '';

    state.generatedEmails.forEach((email, index) => {
        const emailItem = document.createElement('div');
        emailItem.className = 'email-item';
        emailItem.innerHTML = `
            <input type="checkbox" class="email-checkbox" data-index="${index}">
            <span class="email-address">${email.to}</span>
        `;

        emailItem.addEventListener('click', (e) => {
            if (e.target.classList.contains('email-checkbox')) {
                toggleEmailSelection(index);
            } else {
                selectEmail(index);
            }
        });

        elements.emailList.appendChild(emailItem);
    });

    updateSendButton();
}

function selectEmail(index) {
    state.currentEmailIndex = index;

    // Update UI
    document.querySelectorAll('.email-item').forEach((item, i) => {
        item.classList.toggle('selected', i === index);
    });

    renderEmailPreview();
    updateNavigationButtons();
}

function toggleEmailSelection(index) {
    const checkbox = document.querySelector(`[data-index="${index}"]`);

    if (checkbox.checked) {
        state.selectedEmails.add(index);
    } else {
        state.selectedEmails.delete(index);
    }

    updateSendButton();
}

function updateSendButton() {
    const count = state.selectedEmails.size;
    elements.sendEmailsBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        Send ${count} Email${count !== 1 ? 's' : ''}
    `;
    elements.sendEmailsBtn.disabled = count === 0;
    updateSelectAllButton();
}

// ===========================
// Select All / Deselect All
// ===========================
function toggleSelectAll() {
    const allSelected = state.selectedEmails.size === state.generatedEmails.length;

    if (allSelected) {
        // Deselect all
        state.selectedEmails.clear();
        document.querySelectorAll('.email-checkbox').forEach(cb => cb.checked = false);
    } else {
        // Select all
        state.selectedEmails.clear();
        state.generatedEmails.forEach((_, index) => {
            state.selectedEmails.add(index);
        });
        document.querySelectorAll('.email-checkbox').forEach(cb => cb.checked = true);
    }

    updateSendButton();
}

function updateSelectAllButton() {
    const allSelected = state.selectedEmails.size === state.generatedEmails.length;

    if (allSelected) {
        elements.selectAllCheckbox.checked = true;
        elements.selectAllText.textContent = 'Deselect All';
    } else {
        elements.selectAllCheckbox.checked = false;
        elements.selectAllText.textContent = 'Select All';
    }
}

// ===========================
// Email Preview
// ===========================
function renderEmailPreview() {
    if (state.currentEmailIndex === -1 || !state.generatedEmails[state.currentEmailIndex]) {
        elements.emailContent.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <h3>No email selected</h3>
                <p>Upload a CSV file or select an email from the list to preview</p>
            </div>
        `;
        return;
    }

    const email = state.generatedEmails[state.currentEmailIndex];

    elements.emailContent.innerHTML = `
        <div class="email-field">
            <div class="field-label">From:</div>
            <div class="field-value">${email.from}</div>
        </div>
        <div class="email-field">
            <div class="field-label">To:</div>
            <div class="field-value">${email.to}</div>
        </div>
        <div class="email-field">
            <div class="field-label">Cc:</div>
            <div class="field-value">${email.cc}</div>
        </div>
        <div class="email-field">
            <div class="field-label">Subject:</div>
            <div class="field-value">
                <input type="text" value="${email.subject}" id="emailSubject">
            </div>
        </div>
        <div class="email-field">
            <div class="field-label">Body:</div>
            <div class="field-value">
                <textarea id="emailBody">${email.body}</textarea>
            </div>
        </div>
        <div class="email-field">
            <div class="field-label">Attachments:</div>
            <div class="field-value">
                <div class="attachments">
                    ${email.attachments.map(att => `
                        <div class="attachment-tag">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                            ${att}
                            <button class="remove-attachment">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Add event listeners for editing
    document.getElementById('emailSubject').addEventListener('input', (e) => {
        email.subject = e.target.value;
    });

    document.getElementById('emailBody').addEventListener('input', (e) => {
        email.body = e.target.value;
    });
}

// ===========================
// Navigation
// ===========================
function navigateEmail(direction) {
    if (state.generatedEmails.length === 0) return;

    let newIndex = state.currentEmailIndex + direction;

    // Circular navigation - wrap around
    if (newIndex >= state.generatedEmails.length) {
        newIndex = 0; // Go to first email
    } else if (newIndex < 0) {
        newIndex = state.generatedEmails.length - 1; // Go to last email
    }

    selectEmail(newIndex);
}

function updateNavigationButtons() {
    // Always enable navigation buttons if there are emails
    const hasEmails = state.generatedEmails.length > 0;
    elements.prevEmailBtn.disabled = !hasEmails;
    elements.nextEmailBtn.disabled = !hasEmails;
}

// ===========================
// Search
// ===========================
function handleSearch(e) {
    const query = e.target.value.toLowerCase();

    document.querySelectorAll('.email-item').forEach((item, index) => {
        const email = state.generatedEmails[index].to.toLowerCase();
        item.style.display = email.includes(query) ? 'flex' : 'none';
    });
}

// ===========================
// Send Emails
// ===========================
function handleSendEmails() {
    if (state.selectedEmails.size === 0) {
        showToast('Please select at least one email to send', 'error');
        return;
    }

    // Simulate sending
    showToast(`Sending ${state.selectedEmails.size} emails...`, 'success');

    setTimeout(() => {
        showToast(`Successfully sent ${state.selectedEmails.size} emails!`, 'success');

        // Clear selections
        state.selectedEmails.clear();
        document.querySelectorAll('.email-checkbox').forEach(cb => cb.checked = false);
        updateSendButton();
    }, 2000);
}

// ===========================
// Toast Notifications
// ===========================
function showToast(message, type = 'success') {
    elements.toastMessage.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// ===========================
// Initialize Application
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();

    // Load sample data for demo
    loadSampleData();
});

// ===========================
// Sample Data (for demo)
// ===========================
function loadSampleData() {
    const sampleLeads = [
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

    state.leads = sampleLeads;
    state.generatedEmails = sampleLeads.map(lead => ({
        from: 'frommailid@gmail.com',
        to: lead.email,
        cc: 'ccmailid@gmail.com',
        subject: generateSubject(lead),
        body: generateEmailBody(lead),
        attachments: ['Sample.pdf', 'Sample.pdf'],
        lead: lead
    }));

    renderEmailList();

    // Select all emails by default
    state.generatedEmails.forEach((_, index) => {
        state.selectedEmails.add(index);
    });
    document.querySelectorAll('.email-checkbox').forEach(cb => cb.checked = true);
    updateSendButton();

    // Auto-select first email for preview
    if (state.generatedEmails.length > 0) {
        selectEmail(0);
    }
}
