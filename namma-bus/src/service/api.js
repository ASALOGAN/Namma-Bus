import polylineData from "../data/busRoutePolylineProcessed.json";
import routeMeta from "../data/busRoute.json";

/* ======================================================
   ROUTE SETUP
====================================================== */
// Build full route (start → polyline → college)
const route = [
  routeMeta.start_point,
  ...polylineData.path,
  routeMeta.end_point,
];

let index = 0;
let busSpeed = 0;
let hasStarted = false;

// Fast animation step for demo
const animationStep = 4;

/* ======================================================
   DISTANCE FUNCTION (Haversine)
====================================================== */
function distanceKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;

  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * R * Math.asin(Math.sqrt(h));
}

/* ======================================================
   PRECOMPUTE STOP INDEXES (so we know which stop is passed)
====================================================== */
function findClosestRouteIndex(stop) {
  let bestIndex = 0;
  let bestDist = Infinity;

  for (let i = 0; i < route.length; i++) {
    const d = distanceKm(stop, route[i]);
    if (d < bestDist) {
      bestDist = d;
      bestIndex = i;
    }
  }

  return bestIndex;
}

// Assign route index to each stop & college
routeMeta.stops.forEach((stop) => {
  stop._routeIndex = findClosestRouteIndex(stop);
});

routeMeta.end_point._routeIndex = route.length - 1;

/* ======================================================
   NEXT STOP (based on route order, not nearest)
====================================================== */
function getNextStopByOrder(currentIndex) {
  const all = [...routeMeta.stops, routeMeta.end_point];

  for (const stop of all) {
    if (stop._routeIndex > currentIndex) {
      const dist = distanceKm(route[currentIndex], stop);
      return { nextStop: stop, distanceToNext: dist };
    }
  }

  // Nothing ahead → at college
  return {
    nextStop: null,
    distanceToNext: 0,
  };
}

/* ======================================================
   SPEED RANGE
====================================================== */
function getRandomSpeed() {
  return 35 + Math.random() * 10; // 35–45 km/h
}

/* ======================================================
   SIMULATE BUS TICK
====================================================== */
export async function simulateTick() {
  // FIRST TICK
  if (!hasStarted) {
    hasStarted = true;
    index = 0;

    const info = getNextStopByOrder(index);

    return {
      lat: route[index].lat,
      lng: route[index].lng,
      speed: 0,
      index,
      nextStop: info.nextStop,
      distanceToNextStop: info.distanceToNext,
      completed: false,
    };
  }

  // MOVE INDEX
  index += animationStep;

  // FINAL STOP REACHED
  if (index >= route.length - 1) {
    index = route.length - 1;

    return {
      lat: route[index].lat,
      lng: route[index].lng,
      speed: 0,
      index,
      nextStop: null,
      distanceToNextStop: 0,
      completed: true, // tell simulation engine to stop
    };
  }

  // NORMAL MOVEMENT
  const pos = route[index];

  if (Math.random() < 0.3) busSpeed = getRandomSpeed();

  const info = getNextStopByOrder(index);

  return {
    lat: pos.lat,
    lng: pos.lng,
    speed: Math.round(busSpeed),
    index,
    nextStop: info.nextStop,
    distanceToNextStop: info.distanceToNext,
    completed: false,
  };
}

/* ======================================================
   RESET SIMULATION
====================================================== */
export function resetBus() {
  index = 0;
  hasStarted = false;
  busSpeed = 0;
}

/* ======================================================
   ETA LIST — REALISTIC + ROUTE ORDERED + REMOVES PASSED
====================================================== */
export function getAllEtas(currentPos, currentIndex) {
  const speed = busSpeed || 40;
  const kmPerMin = speed / 60;

  const allStops = [...routeMeta.stops, routeMeta.end_point];

  let cumulativeDist = 0;
  const results = [];

  for (const stop of allStops) {
    // Skip stops already passed
    if (stop._routeIndex <= currentIndex) continue;

    const dist = distanceKm(currentPos, stop);

    // Use cumulative distance to ensure increasing ETA
    const eta = Math.max(1, Math.round((dist + cumulativeDist) / kmPerMin));

    results.push({
      stop: stop.name,
      distance_km: dist.toFixed(2),
      final_eta: eta,
    });

    cumulativeDist += dist;
  }

  return Promise.resolve(results);
}
