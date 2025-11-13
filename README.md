# Leaderboard App

A single-page React application built with Vite that displays leaderboard slides for brag documents and attendance tracking. The app automatically rotates between slides and fetches data from Supabase.

## Features

- 🏆 **Brag Documents Leaderboard**: Displays achievements with points ranking
- 📅 **Attendance Leaderboard**: Shows attendance statistics with visual percentage bars
- 🔄 **Auto-rotation**: Slides automatically switch every 10 seconds
- 🎯 **Manual Navigation**: Previous/Next buttons and slide indicators for manual control
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Beautiful UI**: Gradient backgrounds, smooth animations, and professional styling

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Supabase** for backend and database
- **CSS3** for styling with gradients and animations

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. The Supabase client is already configured in `src/integrations/supabase/client.ts`

### Database Schema

Make sure your Supabase database has these tables:

#### brag_documents
```sql
CREATE TABLE brag_documents (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL,
  achievement TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### attendance
```sql
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL,
  days_present INTEGER NOT NULL,
  total_days INTEGER NOT NULL,
  attendance_percentage NUMERIC NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW()
);
```

### Running the App

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
leaderboard/
├── src/
│   ├── components/
│   │   ├── BragDocumentSlide.tsx    # Brag documents leaderboard component
│   │   └── AttendanceSlide.tsx      # Attendance leaderboard component
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts            # Supabase client configuration
│   │       └── types.ts             # TypeScript types for database
│   ├── App.tsx                      # Main app with slide navigation
│   ├── App.css                      # Main styles
│   ├── index.css                    # Global styles
│   └── main.tsx                     # App entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Features Explained

### Slide Navigation
- **Auto-rotation**: Slides change every 10 seconds automatically
- **Manual controls**: Use Previous/Next buttons or click on slide indicators
- **Smooth transitions**: Slides animate in with fade and slide effects

### Data Fetching
- Data is fetched from Supabase when each slide component mounts
- Automatic sorting by points (brag documents) and attendance percentage
- Loading and error states for better UX

### Responsive Design
- Desktop: Full-width tables with all columns visible
- Tablet: Optimized spacing and font sizes
- Mobile: Compact layout with scrollable tables

## Customization

### Change Auto-rotation Time
Edit the interval in `src/App.tsx`:
```typescript
// Change 10000 (10 seconds) to your desired time in milliseconds
setInterval(() => {
  setCurrentSlide((prev) => (prev + 1) % slides.length);
}, 10000);
```

### Add More Slides
Add new components and update the `slides` array in `src/App.tsx`:
```typescript
const slides = [
  { component: <BragDocumentSlide />, name: 'Brag Documents' },
  { component: <AttendanceSlide />, name: 'Attendance' },
  { component: <YourNewSlide />, name: 'Your Slide' },
];
```

### Modify Colors
Update the gradient colors in `src/App.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## License

MIT

