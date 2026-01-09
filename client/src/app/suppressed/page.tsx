export default function SuppressedPage() {
    // Mock suppressed email data
    const suppressedEmails = [
        { id: 1, email: 'bounced@example.com', reason: 'Hard Bounce', date: '2026-01-05' },
        { id: 2, email: 'unsubscribed@company.com', reason: 'Unsubscribed', date: '2026-01-04' },
        { id: 3, email: 'spam@domain.com', reason: 'Spam Complaint', date: '2026-01-03' },
        { id: 4, email: 'invalid@test.com', reason: 'Invalid Email', date: '2026-01-02' },
        { id: 5, email: 'blocked@mail.com', reason: 'Blocked', date: '2026-01-01' },
        { id: 6, email: 'opt-out@service.com', reason: 'Opt-out Request', date: '2025-12-30' },
        { id: 7, email: 'error@provider.com', reason: 'Delivery Error', date: '2025-12-28' },
        { id: 8, email: 'rejected@inbox.com', reason: 'Rejected', date: '2025-12-27' },
    ];

    return (
        <div className="suppressed-container">
            <div className="suppressed-header">
                <h1 className="suppressed-title">Suppressed Mail IDs</h1>
                <p className="suppressed-subtitle">Emails that cannot receive outreach</p>
            </div>

            <div className="suppressed-table-container">
                <table className="suppressed-table">
                    <thead>
                        <tr>
                            <th>Email Address</th>
                            <th>Reason</th>
                            <th>Date Added</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppressedEmails.map((item) => (
                            <tr key={item.id}>
                                <td className="email-cell">{item.email}</td>
                                <td className="reason-cell">
                                    <span className="reason-badge">{item.reason}</span>
                                </td>
                                <td className="date-cell">{item.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {suppressedEmails.length === 0 && (
                <div className="empty-suppressed">
                    <p>No suppressed emails found</p>
                </div>
            )}
        </div>
    );
}
