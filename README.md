# TrackFlow - Supply Chain Management Frontend

Modern supply chain management dashboard built with React, TypeScript, and Vite.

## Features

- 🔐 **User Authentication** - Secure login with JWT tokens
- 📊 **Dashboard** - Real-time overview of orders, shipments, and inventory
- 📦 **Inventory Management** - Track stock levels and warehouse locations
- 🚚 **Shipment Tracking** - Monitor shipments with real-time status updates
- 📋 **Order Management** - Create and manage orders efficiently
- 🤖 **AI Chatbot** - Gemini AI-powered assistant for supply chain queries
- 👥 **Role-Based Access** - Separate views for retailers and distributors
- 🎨 **Modern UI** - Built with Tailwind CSS and Shadcn UI components

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Query** - Data fetching
- **React Router** - Navigation
- **Gemini AI** - AI chatbot integration

## Prerequisites

- Node.js 18+ or Bun
- Backend API running (see backend README)

## Installation

```bash
# Install dependencies
npm install
# or
bun install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from: https://makersuite.google.com/app/apikey

## Development

```bash
# Start development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

## Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── ui/          # Shadcn UI components
│   ├── AIChatBot.tsx
│   ├── AppHeader.tsx
│   └── AppLayout.tsx
├── pages/           # Page components
│   ├── retailer/    # Retailer-specific pages
│   ├── distributor/ # Distributor-specific pages
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   └── Profile.tsx
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Features Guide

### AI Chatbot

The AI chatbot uses Google's Gemini AI to answer questions about:
- Current orders and their status
- Shipment tracking and locations
- Inventory levels and stock alerts
- General supply chain queries

The chatbot automatically fetches your real-time data and provides contextual answers.

### User Roles

- **Retailer**: Access to orders, inventory, sales, and tracking
- **Distributor**: Access to orders, inventory, shipments, and returns
- **Admin**: Full access to all features

### Data Isolation

Each user only sees their own data. All API requests are authenticated and filtered by user ID.

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## Environment-Specific Builds

```bash
# Development build
npm run build:dev

# Production build
npm run build
```

## Troubleshooting

### API Connection Issues

- Ensure backend is running
- Check `VITE_API_URL` in `.env`
- Verify CORS settings in backend

### AI Chatbot Not Working

- Verify `VITE_GEMINI_API_KEY` is set
- Check API key is valid
- Ensure you have internet connection

### Authentication Issues

- Clear localStorage
- Check JWT token expiration
- Verify backend auth middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License
