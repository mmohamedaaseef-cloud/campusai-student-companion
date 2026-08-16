# CampusAI – Your AI Student Companion

CampusAI is a full-stack web application that helps college students study smarter. It features an AI study assistant, notes management, subject organization, task tracking, and a personal profile — all behind secure authentication.

## Tech Stack

**Frontend**
- React + Vite
- TypeScript
- Tailwind CSS (with dark/light theme)
- React Router (client-side routing)
- Lucide React (icons)

**Backend**
- Supabase (PostgreSQL database, auth, and edge functions)
- Edge Function for the AI assistant (Google Gemini API)

> This project was built on Bolt, which provisions a Supabase backend. The original spec called for Express + MongoDB; the equivalent functionality (auth, CRUD APIs, AI proxy) is implemented using Supabase's database, auth, and edge functions.

## Features

- **Landing Page** — modern hero, features, subjects, AI assistant showcase, and footer
- **Authentication** — email/password sign up and sign in, secure session management, protected routes
- **Student Dashboard** — welcome message, study progress ring, stats, quick actions, recent notes and tasks
- **AI Study Assistant** — chat interface that proxies to Google Gemini for explanations, summaries, and study notes
- **Notes Management** — full CRUD, search, and subject filtering
- **Subject Management** — add/edit/delete subjects with color coding
- **Study Tasks** — create, edit, delete, mark complete, filter by status, set priority and due dates
- **Profile** — view and edit name, college, department, and year
- **Dark/Light Theme** — toggle that persists across sessions

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (already provisioned on Bolt)

### Installation

```bash
npm install
```

### Environment Variables

The Supabase connection variables are pre-populated in the Bolt environment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

To enable the AI assistant, set the `GEMINI_API_KEY` secret on the Supabase project (Edge Function secrets). Without it, the assistant will respond with a friendly fallback message.

### Running the App

The dev server starts automatically on Bolt. To run locally:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Building

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Input, Modal, Card)
│   ├── DashboardLayout.tsx
│   └── Toast.tsx
├── context/
│   ├── AuthContext.tsx   # Auth provider (sign up, sign in, sign out, profile)
│   └── ThemeContext.tsx  # Dark/light theme provider
├── lib/
│   └── supabase.ts       # Supabase client and shared types
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardHome.tsx
│   ├── AIAssistantPage.tsx
│   ├── NotesPage.tsx
│   ├── SubjectsPage.tsx
│   ├── TasksPage.tsx
│   └── ProfilePage.tsx
├── App.tsx               # Routes
└── main.tsx              # Entry point with providers

supabase/
└── functions/
    └── ai-chat/
        └── index.ts      # Edge function proxying to Google Gemini
```

## Database Schema

Four tables, all with Row Level Security (RLS) enabled and owner-scoped policies:

- **profiles** — extends `auth.users` with student details (name, college, department, year)
- **subjects** — user-owned subjects with name, description, and color
- **notes** — user-owned notes, optionally linked to a subject
- **tasks** — user-owned study tasks with priority, due date, and completion status

A database trigger automatically creates a profile row when a new user signs up.

## API Routes

The frontend communicates with Supabase directly for auth and CRUD. The AI assistant uses an edge function:

| Feature | Method | Endpoint |
|---------|--------|----------|
| AI Chat | POST | `/functions/v1/ai-chat` |
| Health  | GET   | Supabase project health check |

## License

MIT
