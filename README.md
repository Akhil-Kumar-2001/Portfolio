# Akhil Kumar S - Developer Portfolio

A premium, glossy, cyber-aesthetic developer portfolio built with NestJS and Next.js.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Framer Motion, React Three Fiber (Drei)
- **Backend:** NestJS, Nodemailer
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Create a `.env` file in the `backend` root (copy from `.env.example`).
   - Update the mail credentials:
     ```env
     MAIL_HOST=smtp.gmail.com
     MAIL_PORT=587
     MAIL_USER=your-email@gmail.com
     MAIL_PASS=your-app-password
     ```
   *Note: If using Gmail, you need to generate an App Password.*

4. Start the server:
   ```bash
   npm run start:dev
   ```
   The backend runs on `http://localhost:3001`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend runs on `http://localhost:3000`.

## Features

- **3D Hero Section:** Interactive metallic cube using React Three Fiber.
- **Animated Intro:** Smooth loading screen with progress bar.
- **Projects Showcase:** Glassmorphism cards with hover effects.
- **Contact Form:** Integrated with NestJS backend to send real emails.
- **Responsive Design:** Fully optimized for all devices.

## Customization

- **Theme:** Colors are defined in `frontend/src/app/globals.css`.
- **Content:** Update components in `frontend/src/components/` to change text and images.

