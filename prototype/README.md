# AI Cold Email Outreach Tool

A beautiful, modern web-based tool for sales teams to upload CSV files of leads and generate personalized cold emails with AI assistance.

## 🚀 Features

- **CSV Upload**: Drag-and-drop or click to upload lead CSV files
- **AI Email Generation**: Automatically generate personalized emails for each lead
- **Email Preview & Editing**: Review and edit generated emails before sending
- **Bulk Selection**: Select multiple emails to send at once
- **Search Functionality**: Quickly find specific email addresses
- **Dark Theme UI**: Modern, professional dark-themed interface
- **Responsive Design**: Works on desktop and mobile devices

## 📋 CSV Format

Your CSV file must include the following columns:

```
name,company,designation,industry,email,web_url
```

**Example:**
```csv
Nathan Williams,TechCorp Solutions,CEO,Technology,nathan@techcorp.com,https://techcorp.com
Sarah Johnson,InnovateLabs,CTO,Software,sarah@innovatelabs.com,https://innovatelabs.com
```

See `sample-leads.csv` for a complete example.

## 🎯 Getting Started

### Quick Start

1. Open `index.html` in your web browser
2. The app loads with sample data for demonstration
3. Click "New Upload" to upload your own CSV file
4. Review and edit generated emails
5. Select emails and click "Send X Emails"

### File Structure

```
Sol-Z/
├── index.html          # Main HTML file
├── styles.css          # Styling and theme
├── script.js           # Application logic
├── sample-leads.csv    # Sample CSV file
└── README.md          # This file
```

## 💡 How It Works

1. **Upload CSV**: Click "New Upload" and select a CSV file with your leads
2. **Auto-Generation**: The app parses the CSV and generates personalized emails
3. **Review**: Browse through generated emails using the sidebar or navigation arrows
4. **Edit**: Click on any field to edit the email content
5. **Select**: Check the boxes next to emails you want to send
6. **Send**: Click "Send X Emails" to send selected emails

## 🎨 Features in Detail

### Email Personalization

Each generated email includes:
- Personalized greeting using the lead's name
- Company-specific messaging
- Industry-relevant content
- Reference to the lead's designation
- Website URL mention

### UI Features

- **Search**: Filter emails by email address
- **Navigation**: Use arrow buttons to move between emails
- **Inline Editing**: Edit subject and body directly in the preview
- **Attachments**: View and manage email attachments
- **Toast Notifications**: Get feedback on actions

## 🔧 Future Enhancements

### Phase 1 (Current)
- ✅ CSV upload and parsing
- ✅ Email preview and editing
- ✅ Sample email generation
- ✅ Dark theme UI

### Phase 2 (Planned)
- 🔄 Integration with Ollama/Hugging Face for AI generation
- 🔄 Microsoft Graph API integration for real email sending
- 🔄 Campaign management and tracking
- 🔄 Email templates library
- 🔄 Send status tracking (sent/failed)
- 🔄 Rate limiting for email sending

### Phase 3 (Future)
- 📅 Database integration (PostgreSQL)
- 📅 User authentication
- 📅 Analytics dashboard
- 📅 A/B testing for email content
- 📅 Follow-up sequence automation

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with CSS Variables
- **Icons**: SVG icons (inline)
- **Fonts**: Google Fonts (Inter)

## 📝 Notes

### Current Implementation

This is a **frontend-only MVP** that demonstrates the UI and workflow. Key features:

- CSV parsing is done client-side using JavaScript
- Email generation uses template-based logic (not AI yet)
- "Send" functionality is simulated (no actual emails sent)
- Data is stored in memory (no persistence)

### Next Steps for Production

To make this production-ready:

1. **AI Integration**: Connect to Ollama or Hugging Face API
2. **Email Sending**: Integrate Microsoft Graph API
3. **Backend**: Add Node.js/Express server for API handling
4. **Database**: Set up PostgreSQL for data persistence
5. **Authentication**: Add user login and session management
6. **Deployment**: Deploy to Vercel or similar platform

## 🎯 Usage Tips

1. **Testing**: Use the included `sample-leads.csv` file for testing
2. **CSV Format**: Ensure your CSV has all required columns
3. **Email Validation**: Invalid email addresses are automatically filtered out
4. **Editing**: All email fields are editable before sending
5. **Selection**: Use checkboxes to select specific emails to send

## 🐛 Troubleshooting

**CSV upload not working?**
- Ensure the file is in CSV format
- Check that all required columns are present
- Verify email addresses are valid

**Emails not displaying?**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

## 📄 License

This project is for internal use. All rights reserved.

## 👥 Support

For questions or issues, contact your development team.

---

**Built with ❤️ for sales teams**
