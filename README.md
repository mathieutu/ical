# iCal Tools

**[ical.mathieutu.dev](https://ical.mathieutu.dev)** - Powerful calendar manipulation and analysis tools

A web application for merging, filtering, analyzing, and converting iCal calendar feeds. Perfect for freelancers tracking billable hours, project managers analyzing team time, or anyone wanting to understand and manipulate their calendar data.

## Features

- **Merge Multiple Calendars**: Combine multiple iCal feeds into a single unified calendar
- **Filter & Analyze Events**: Filter by date range, search by event title, and get statistics about your calendar data
- **Calculate Billable Hours**: Track time spent on meetings and projects with hourly rate calculations
- **Export to Multiple Formats**: Export filtered and analyzed data to iCal (`.ics`), JSON, or CSV
- **Privacy First**: All operations are performed on-the-fly on the server. No data is stored.
- **Bookmark Calendars**: Save frequently used calendar configurations for quick access

## Tech Stack

- **[SvelteKit](https://kit.svelte.dev/)** - Full-stack framework with SSR
- **[Svelte 5](https://svelte.dev/)** - Reactive UI framework with modern runes syntax
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** + **[daisyUI 5](https://daisyui.com/)** - Styling and UI components
- **[ical.js](https://github.com/mozilla-comm/ical.js)** - iCalendar parsing and manipulation
- **[date-fns](https://date-fns.org/)** - Date utilities
- **[Vite](https://vitejs.dev/)** - Build tool and dev server

## Key Entry Points

### 1. Homepage ([src/routes/+page.svelte](src/routes/+page.svelte))
The landing page where users input one or more calendar feed URLs. Features include:
- Dynamic form inputs for multiple calendar URLs
- Bookmark display and management
- Feature documentation

### 2. Analysis Page ([src/routes/analyse/+page.svelte](src/routes/analyse/+page.svelte) + [+page.ts](src/routes/analyse/+page.ts))
The main application interface that:
- Fetches and merges multiple calendar feeds
- Provides filtering UI (date range, search, sort)
- Displays event statistics and billable hours
- Offers export options (iCal, JSON, CSV)

The `+page.ts` file handles:
- Loading calendar data via the JSON API
- URL query parameter parsing
- Event filtering and sorting logic

### 3. API Endpoints

#### JSON API ([src/routes/json/+server.ts](src/routes/json/+server.ts))
The core API that:
- Fetches calendar feeds from provided URLs
- Merges multiple calendars
- Applies filters (date range, search term)
- Returns structured JSON with events and statistics

Parameters:
- `urls`: One or more calendar feed URLs
- `from`: Start date filter (ISO format)
- `to`: End date filter (ISO format)
- `search`: Search term for event summaries

#### iCal Export ([src/routes/ics/+server.ts](src/routes/ics/+server.ts))
Exports filtered events back to iCal format using the same filtering parameters.

#### CSV Export ([src/routes/csv/+server.ts](src/routes/csv/+server.ts))
Exports filtered events to CSV format for spreadsheet analysis.

## Development

### Prerequisites
- Node.js 18+ 
- yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/mathieutu/ical.git
cd ical

# Install dependencies
yarn install
# Start the development server
yarn dev

# Open the app in your browser
yarn dev -- --open
```

## Contributing

Contributions are welcome! If you have an idea for a new feature, find a bug, or want to improve documentation, please open an issue or submit a pull request.

## License

[MIT](./LICENSE)

## Author

Made by [@mathieutu](https://github.com/mathieutu)
