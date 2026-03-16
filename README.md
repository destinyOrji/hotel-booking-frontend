# Hotel Booking System - Frontend

A modern React.js application for hotel booking management with separate user and admin interfaces.

## Features

### User Interface
- Room search and booking
- User authentication and profile management
- Booking history and management
- Hotel information pages (About, Contact, FAQ)

### Admin Interface
- Dashboard with key metrics
- Room management
- Booking management
- Availability and rate management
- User management
- Reports and analytics
- Hotel settings and configuration
- Staff management
- Promotions management

## Tech Stack

- **React 18+** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **date-fns** - Date manipulation
- **Vite** - Build tool and dev server

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (Button, Card, Modal, etc.)
│   ├── forms/           # Form components (Input, Select, DatePicker, etc.)
│   ├── layout/          # Layout components (Header, Footer, Sidebar, etc.)
│   └── ui/              # UI-specific components (RoomCard, BookingCard, etc.)
├── pages/
│   ├── user/            # User-facing pages
│   ├── auth/            # Authentication pages
│   └── admin/           # Admin pages
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── utils/               # Utility functions
├── styles/              # Global styles
├── App.jsx
├── routes.jsx
└── index.jsx
```

## Development

The application runs on `http://localhost:3000` by default.

## License

Private - All rights reserved
