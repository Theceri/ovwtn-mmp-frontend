# OVWTN Membership Management Platform - Frontend

Next.js 15 frontend for the One Voice Women Trade Network Membership Management Platform.

## Project Structure

```
ovwtn-mmp-frontend/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── layout.js     # Root layout
│   │   ├── page.js       # Home page
│   │   └── globals.css   # Global styles with brand colors
│   ├── components/       # React components
│   │   └── ui/           # Shadcn/UI components
│   ├── lib/              # Utility functions
│   │   ├── api.js        # API client
│   │   └── utils.js      # Helper utilities
│   ├── store/            # Zustand state management
│   │   └── useStore.js   # Global store
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
├── .env.local            # Environment variables
├── .env.example          # Example environment file
├── components.json       # Shadcn/UI config
├── jsconfig.json         # Path aliases
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
└── README.md             # This file
```

## Prerequisites

- Node.js 20.14.0+
- npm or yarn
- Backend API running on http://localhost:8000

## Installation

### Install Dependencies

```bash
npm install
```

## Environment Variables

Create or update `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME="OVWTN Membership Management Platform"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_WHATSAPP_NUMBER=+254743525312
```

## Running the Application

### Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/UI
- **State Management**: Zustand
- **Notifications**: Sonner
- **HTTP Client**: Fetch API
- **Language**: JavaScript (not TypeScript, as per requirements)

## Brand Colors

The application uses the OVWTN brand colors:

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Primary | `#962021` | rgb(150, 32, 33) | Primary actions, headers |
| Secondary | `#385664` | rgb(56, 86, 100) | Secondary elements |
| Accent | `#91a27b` | rgb(145, 162, 123) | Accents, highlights |
| Orange | `#d96534` | rgb(217, 101, 52) | Call-to-actions |

### Text Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Primary Text | `#1B1D1B` | rgb(27, 29, 27) | Headings |
| Secondary Text | `#61657e` | rgb(97, 101, 126) | Body text |
| Tertiary Text | `#9fa1af` | rgb(159, 161, 175) | Captions, labels |

## Features Implemented (Section 1)

### ✅ Completed

- [x] Next.js 15 with App Router and `src/` folder
- [x] Tailwind CSS configuration with OVWTN brand colors
- [x] Shadcn/UI components setup
- [x] Zustand state management
- [x] Sonner toast notifications
- [x] Environment variables structure
- [x] API utility functions (`src/lib/api.js`)
- [x] Basic layout with brand colors
- [x] Health check integration with backend

## API Client

The `src/lib/api.js` file provides utility functions for API calls:

```javascript
import { apiGet, apiPost, apiPut, apiDelete, checkHealth } from '@/lib/api';

// GET request
const data = await apiGet('/endpoint');

// POST request
const response = await apiPost('/endpoint', { key: 'value' });

// Health check
const health = await checkHealth();
```

## State Management

Global state is managed with Zustand:

```javascript
import { useStore } from '@/store/useStore';

function Component() {
  const { user, setUser, isAuthenticated } = useStore();
  
  // Use state...
}
```

## Adding Shadcn/UI Components

To add a new Shadcn/UI component:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
```

Components will be added to `src/components/ui/`.

## Path Aliases

The following path aliases are configured:

- `@/*` → `src/*`
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`
- `@/store` → `src/store`

## Styling Guidelines

### Using Brand Colors

```jsx
// CSS classes
className="bg-[rgb(var(--brand-primary))]"
className="text-[rgb(var(--text-primary))]"

// Tailwind with custom colors
className="bg-primary text-primary-foreground"
```

### Responsive Design

All pages are designed mobile-first:

```jsx
className="flex flex-col md:flex-row lg:grid-cols-3"
```

## Testing Backend Connection

The home page (`src/app/page.js`) includes a health check that tests:
- Backend API connection
- Database connection status
- API version information

## Next Steps

1. Create authentication pages (login, register, password reset)
2. Build multi-step membership application form
3. Create member dashboard
4. Build admin dashboard
5. Implement listings pages
6. Create resource library
7. Add event management
8. Implement AI chat assistant

## Development Guidelines

1. **Mobile-First**: Design for mobile, then scale up
2. **Brand Consistency**: Always use OVWTN brand colors
3. **Accessibility**: Follow WCAG guidelines
4. **Performance**: Optimize images, lazy load components
5. **Code Quality**: Use ESLint, follow Next.js best practices

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Backend Connection Failed

1. Ensure backend is running on http://localhost:8000
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Verify CORS settings in backend

### Styles Not Applying

1. Check Tailwind is properly configured
2. Restart dev server
3. Clear `.next` cache: `rm -rf .next`

### Build Errors

1. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear Next.js cache: `rm -rf .next`
3. Check for ESLint errors: `npm run lint`

## Support

For issues or questions, contact the development team.
