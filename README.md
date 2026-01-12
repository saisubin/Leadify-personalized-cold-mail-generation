# Leadify - Personalized Cold Mail Generation

Leadify is a powerful AI-driven application designed to streamline personalized cold outreach. It automates the process of generating, managing, and reviewing cold emails, helping users scale their outreach efforts while maintaining a personal touch.

## Features

-   **Dashboard Analytics**: Visualize outreach performance with metrics like Total Mails Sent, Opened, Replied, and Suppressed IDs.
-   **Campaign Management**: Create and organize email campaigns. Upload CSV lead lists and manage campaign statuses.
-   **AI-Powered Generation**: automated email generation based on context and lead data.
-   **Review Interface**: A streamlined interface to review, edit, and send generated emails one by one or in bulk.
-   **Suppression Management**: Manage opted-out email addresses to ensure compliance and maintain domain reputation.
-   **Premium Dark UI**: A sleek, modern dark-themed interface for reduced eye strain and a professional aesthetic.

## Tech Stack

### Frontend
-   **Framework**: [Next.js](https://nextjs.org/) (React)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom dark theme.
-   **Icons**: [Lucide React](https://lucide.dev/)

### Backend
-   **Runtime**: Node.js with [Express](https://expressjs.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/) or local).
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **AI Integration**: Google Gemini API (or similar LLM provider).

## Getting Started

### Prerequisites
-   Node.js (v18+)
-   npm or yarn
-   PostgreSQL database

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/saisubin/Leadify-personalized-cold-mail-generation.git
    cd Leadify-personalized-cold-mail-generation
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the `server` directory and configure your database URL and API keys:
    ```env
    DATABASE_URL="postgresql://user:password@host:port/db"
    GEMINI_API_KEY="your_api_key"
    # Add other necessary env vars
    ```

4.  **Database Migration**
    ```bash
    cd server
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the Application**
    You will need to run both the client and server terminals.

    **Server:**
    ```bash
    cd server
    npm run dev
    ```

    **Client:**
    ```bash
    cd client
    npm run dev
    ```

6.  **Access the App**
    Open [http://localhost:3000](http://localhost:3000) to view the application.

## License

This project is licensed under the MIT License.
