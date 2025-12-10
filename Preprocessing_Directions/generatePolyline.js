/**
 * ---------------------------------------------------------
 * Convert Google Directions API JSON → Decoded Polyline File
 * ---------------------------------------------------------
 * Input  : directions.json
 * Output : busRoutePolylineProcessed.json
 */

import fs from "fs";
import polyline from "@mapbox/polyline"; // install using: npm install @mapbox/polyline

// -------------------------------
// Load the input Google JSON file
// -------------------------------
const raw = JSON.parse(fs.readFileSync("./directions.json", "utf8"));

// Navigate into the response
const route = raw.routes[0];
const leg = route.legs[0];
const steps = leg.steps;

// Final combined decoded path
let finalPath = [];

// Helper to compare points
function isSamePoint(a, b) {
  return a.lat === b.lat && a.lng === b.lng;
}

console.log("Decoding step polylines…");

// ------------------------------------
// Extract + decode every step polyline
// ------------------------------------
steps.forEach((step, idx) => {
  if (!step.polyline || !step.polyline.points) return;

  // Decode step polyline → array of [lat, lng]
  const decoded = polyline.decode(step.polyline.points);

  // Convert to object format {lat, lng}
  const converted = decoded.map(([lat, lng]) => ({ lat, lng }));

  // Avoid duplicate at step junctions
  if (finalPath.length > 0) {
    const last = finalPath[finalPath.length - 1];
    const firstOfNew = converted[0];

    if (isSamePoint(last, firstOfNew)) {
      converted.shift(); // remove duplicate
    }
  }

  finalPath.push(...converted);
});

console.log(`Decoded ${finalPath.length} polyline points.`);

// ---------------------------------------
// Remove accidental duplicates globally
// ---------------------------------------
const optimized = [];
const seen = new Set();

for (const pt of finalPath) {
  const key = `${pt.lat.toFixed(6)},${pt.lng.toFixed(6)}`;
  if (!seen.has(key)) {
    seen.add(key);
    optimized.push(pt);
  }
}

console.log(`Optimized to ${optimized.length} points.`);

// -----------------------------------------------------------
// Write final file: busRoutePolylineProcessed.json
// -----------------------------------------------------------
const output = {
  path: optimized,
};

fs.writeFileSync(
  "./busRoutePolylineProcessed.json",
  JSON.stringify(output, null, 2)
);

console.log("✔ File saved as busRoutePolylineProcessed.json");
