# Modern React Portfolio

A professional portfolio web application built with a modern React stack and a dedicated backend for email functionality.

## 🚀 Tech Stack

### Frontend

- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Build Tool:** Vite

### Backend

- **Runtime:** Bun / Node.js
- **Server:** Express
- **Authentication:** Google OAuth2 (for Gmail API)
- **Email Service:** Google Gmail API

## ✨ Features

- **Responsive Design:** Fully responsive layout for all devices.
- **Dark Mode:** Sleek dark-themed UI.
- **Animations:** Smooth entry and hover animations powered by Framer Motion.
- **Contact Form:** Fully functional contact form integrated with Gmail through a custom backend.
  - Secure OAuth2 authentication.
  - Token persistence for reliable server operation.
  - Auto-dismissing status messages.

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Portfolio
```

### 2. Install dependencies

```bash
bun install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following credentials from your Google Cloud Console:

```env
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
```

### 4. Start the Application

You need to run both the frontend and backend servers.

**Backend Server:**

```bash
bun run server
```

_Note: On the first run, visit `http://localhost:{yourPORT)/auth` to authenticate with Google. This will create a `tokens.json` file for persistent access._

**Frontend Development Server:**

```bash
bun run dev --host
```

## 📜 Scripts

- `bun run dev` - Start frontend dev server
- `bun run server` - Start backend Express server
- `bun run build` - Build frontend for production
- `bun run preview` - Preview production build
