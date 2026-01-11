# Leadify - AI Email Outreach Platform

Leadify is an AI-powered email outreach platform that helps you generate personalized cold emails at scale.

## Project Structure

```
Sol-Z/
├── client/              # Frontend (Next.js)
│   ├── src/
│   │   ├── app/         # Next.js pages & layouts
│   │   ├── components/  # React components (organized by feature)
│   │   └── styles/      # CSS files
│   └── public/          # Static assets
│
├── server/              # Backend API (Future)
│   └── src/
│       ├── api/         # API routes
│       ├── services/    # Business logic
│       └── models/      # Data models
│
├── shared/              # Shared code between frontend and backend
│   ├── types/           # TypeScript interfaces
│   └── constants/       # Shared constants
│
├── docs/                # Documentation
└── prototype/           # Original HTML prototype (reference)
```

## Getting Started

### Frontend Development

```bash
cd client
npm install
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Backend Development

Backend is not yet implemented. See `server/` directory for placeholder structure.

## Features

- **Dashboard**: Overview of email outreach metrics
- **Mail Management**: Create and manage email campaigns (events)
- **Email Review**: Review and edit AI-generated emails before sending
- **Suppressed Mail IDs**: Manage bounced and unsubscribed email addresses

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Custom CSS with CSS variables
- **Icons**: Lucide React
- **CSV Parsing**: PapaParse

### Backend (Planned)
- API framework TBD (Express.js or Next.js API routes)
- Database TBD

## Documentation

See `docs/` directory for detailed documentation.

## License

ISC
