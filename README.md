# React Glassmorphic Calendar

A React-based calendar application focused on high-end UI/UX, specifically mimicking VisionOS glassmorphism and physical paper interactions. It avoids heavy animation libraries, relying instead on optimized CSS 3D transforms and complex state management to create a native-app feel in the browser.

## Features

* **Physics-Based Page Flips:** Replaces standard view transitions with a custom `@keyframes` animation. Uses `rotate3d` and `translateZ` to simulate the physical peel, lift, and fold of a heavy-paper wall calendar.
* **Dynamic Glassmorphism:** Uses `backdrop-filter`, `mask-image` gradient fading, and modern `color-mix()` CSS to dynamically tint frosted glass elements based on the active month's theme color.
* **Dual-Mode Selection:** * Single-click highlights a specific day to view its events.
  * Double-click initiates a date range selector, complete with a dynamically updating floating counter.
* **Smart Event Routing:** Clicking any event in the yearly overview panel parses the event data and instantly routes the calendar state to that specific month and year.
* **Custom UI Components:** Completely bypasses native browser `<select>` dropdowns, using custom React state-driven components to maintain the translucent UI aesthetic.
* **Event Management:** Supports hardcoded system events (recurring yearly) and user-generated custom events with smart deduplication to prevent overlapping titles on the same day.

## Tech Stack

* **React:** Handles the complex prop-drilling and state management required to keep the grid, sidebars, and header completely in sync without re-rendering issues.
* **SCSS:** Manages all styling, layout, and 3D animations natively to ensure high performance without the overhead of libraries like Framer Motion.
* **date-fns:** Chosen over native JS Date objects for its functional, immutable approach. Crucial for handling complex interval math, month-boundary constraints, and leap years without crashing the React render cycle.
* **lucide-react:** Lightweight, customizable SVG icon set.

## Running Locally

To run this project on your local machine:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (assuming Vite or Create React App):
   ```bash
   npm run dev 
   # or npm start
   ```
4. Open your browser to the local port specified in your terminal (usually `http://localhost:5173` or `http://localhost:3000`).

## Storage

This project uses the browser's `localStorage` to persist user-created events. If you need to reset the data, you can clear your browser's local storage or delete events individually via the UI.
