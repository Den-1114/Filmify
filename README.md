# TMDB Streaming Platform

A modern movie streaming platform frontend built with React, featuring content from The Movie Database (TMDB).

## Features

- Browse trending, top rated, now playing, upcoming, and popular movies
- Movie card carousel with horizontal scrolling
- Responsive design with Tailwind CSS
- Movie detail pages
- Watch functionality
- Clean, modern UI

## Tech Stack

- **React 19.2** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **React Router DOM 7.12** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Icon library
- **TMDB API** - Movie data source

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your TMDB API key:
```
VITE_TMDB_KEY=your_tmdb_api_key_here
```

To get a TMDB API key, sign up at [https://www.themoviedb.org/](https://www.themoviedb.org/)

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Linting

Run ESLint:
```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── movies/
│   │   ├── Card.tsx          # Movie card component
│   │   └── MovieRow.tsx      # Movie row/carousel
│   ├── Footer.tsx
│   └── Navbar.tsx
├── pages/
│   ├── Main.tsx              # Home page with movie categories
│   ├── Movie.tsx             # Movie detail page
│   └── Watch.tsx             # Watch page
├── GlobalContext.ts          # Global context for app state
├── GlobalProvider.tsx         # Context provider
├── App.tsx                   # Main app with routing
└── main.tsx                  # Application entry point
```

## Routes

- `/` - Home page with movie categories
- `/video/:id/:mediaType` - Movie details page
- `/watch/:id/:mediaType` - Watch page

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_TMDB_KEY` | Your TMDB API key |

## License
[![License](https://img.shields.io/badge/License-EPL%202.0-red.svg)](LICENSE)
