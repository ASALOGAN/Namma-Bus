# Namma Bus – College Bus Live Tracking MVP

Namma Bus is a **React-based proof-of-concept (MVP)** that simulates a **live college bus route**, shows the bus **moving on a real Google Maps route**, and computes **real-time ETAs for each stop** using a simple simulation engine.

This repository is designed as a **demo / playground** to showcase the idea and UX before integrating with real GPS hardware or backend services.

---

## Features

- **Live Bus Animation**
  - Bus moves along a real route extracted from **Google Maps Directions API**.
  - Fast animation for demo purposes, with realistic speed (35–45 km/h).

- **Google Maps Integration**
  - Full route polyline rendered on a Google Map.
  - Clear markers for:
    - Start point (Devegowda Circle)
    - All intermediate stops
    - End point (MyCEM College)

- **Real-Time ETA Calculation**
  - Distance-based ETA in minutes for each upcoming stop.
  - ETAs always increase from stop to stop (closer stop → lower ETA, farther → higher).
  - Once the bus passes a stop, that stop is **removed from the ETA list**.

- **Sidebar Control & Status**
  - Start / Reset “Simulation” button.
  - Bus Status Card:
    - Live speed (km/h)
    - Next stop name
    - Distance to next stop
  - ETA Table:
    - Remaining stops only
    - ETA in minutes for each stop
  - AI Analysis card placeholder (future AI integration).

- **MVP Simulation Engine**
  - Uses a JSON polyline route instead of real GPS data.
  - Ready to be swapped with a real backend or hardware later.

---

## Tech Stack

- **Frontend Framework:** React (Vite / SPA)
- **Maps:** `@react-google-maps/api`
- **Icons:** `react-icons`
- **State Management:** React hooks (`useState`, `useEffect`, `useRef`)
- **Routing / Data:**
  - `busRoute.json` — start, stops, and end (college)
  - `busRoutePolylineProcessed.json` — decoded route polyline points
- **Styling:** Custom CSS (`App.css`, `sidebar.css`)

---

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or later recommended)  
   Download from: https://nodejs.org/

2. **npm** (comes bundled with Node) or **yarn**

3. **Google Maps JavaScript API Key**
   - You need a valid API key with:
     - **Maps JavaScript API** enabled.
   - You can create and manage your API key in the [Google Cloud Console](https://console.cloud.google.com/).

---

## Getting Started

### 1. Clone the Repository

```bash
git https://github.com/ASALOGAN/Namma-Bus.git
cd Namma-Bus/namma-bus
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file at the root of the project:

```bash
touch .env
```

Add your Google Maps API key:

```
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

This key is used by `@react-google-maps/api` inside `MapView.jsx`.

### 4. Run the App in Development Mode

Using npm:

```bash
npm run dev
```

Or using yarn:

```bash
yarn dev
```

You’ll see a URL in the terminal, typically:

```
http://localhost:3000/
```

Open it in your browser.

---

## 🗺️ How to Use the App

Open the app in your browser.

The map will load:
- The route polyline.
- A start marker at Devegowda Circle.
- An end marker at MyCEM College.
- All intermediate stops as small orange dots.

Open the sidebar using the hamburger menu (if you have a header) or view the sidebar if already visible.

In the sidebar:

- Click **“Start Simulation”** to start the demo bus.
- The bus icon will start moving along the route.

**Bus Status Card** will show:
- Current speed
- Next stop
- Distance to next stop

**ETA Table** will show:
- Remaining stops in route order
- ETA in minutes for each stop.

As the bus passes a stop, that stop will disappear from the ETA list.

When the bus reaches the final stop (MyCEM College):
- The simulation is marked as completed.
- You can click Reset to return to the starting state.

---

## 🧠 Architecture Overview (MVP)

**Core Components:**

- **App.jsx**: Wires together Header, Sidebar, MapView. Consumes the `useBusData` hook.
- **hooks/useBusData.js**: Controls the simulation lifecycle:
  - `startSimulation()`
  - `resetSimulation()`
  - Calls `simulateTick()` for each time step.
  - Calls `getAllEtas()` for updated ETA list.
  - Exposes:
    - `location` (lat, lng, speed, nextStop, distanceToNextStop, completed)
    - `etaList` (remaining stops + ETAs)
    - `isSimRunning`
    - `hasCompleted`
- **service/api.js**: Pure simulation + math:
  - Prepares the route (start → polyline → college).
  - Precomputes `_routeIndex` for each stop.
  - `simulateTick()` advances the bus along the route.
  - `getAllEtas()` computes distance-based ETAs and removes passed stops.
- **components/MapView.jsx**: Renders the map using `@react-google-maps/api`.
  - Displays:
    - Route polyline
    - Start/End markers
    - Stop markers
    - Animated bus icon
    - Optional user location marker (from `navigator.geolocation`).
- **components/Sidebar.jsx**: Contains:
  - Start/Reset buttons
  - BusStatusCard
  - AiAnalysisCard (placeholder)
  - ETATable
- **components/sidebar/BusStatusCard.jsx**: Displays:
  - Speed
  - Next stop
  - Distance to next stop.
- **components/sidebar/ETATable.jsx**: Displays ETAs for each remaining stop.
  - Uses the ordered, filtered `etaList` from the hook.

---

## 🧪 Test / Demo Scenarios

You can demonstrate the MVP to stakeholders as follows:

### Initial State
- App loads with route, start/end points, and a stationary bus at the starting point.

### Start Simulation
- Click Start Simulation.
- Show:
  - Bus beginning from Devegowda Circle.
  - Bus Status showing 0 km/h at first tick, then realistic speed.
  - ETA Table populated with all stops + MyCEM College.

### Progress Along the Route
- Watch as:
  - Bus moves quickly between stops.
  - Distance to next stop shrinks.
  - ETAs update smoothly.
  - Passed stops disappear from the ETA table.

### Completion
- When the bus reaches MyCEM College:
  - Simulation stops.
  - Status updates accordingly.
- Use Reset to restart.

---

## 🧭 Future Work (Beyond This MVP)

Replace simulation with real GPS feed from:
- Bus-mounted device, or
- Driver Android/iOS app.

Store real-time data in:
- Firebase Realtime Database / Firestore, or
- AWS / custom backend.

Add AI-based features:
- Traffic / delay prediction.
- Route deviation detection.
- Peak-load forecasting per stop.

Multi-bus support:
- Different routes
- Different timings
- Live bus selection.


