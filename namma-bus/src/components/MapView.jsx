import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

import routePolyline from "../data/busRoutePolylineProcessed.json";
import routeMeta from "../data/busRoute.json";

import busRight from "../assets/bus-right.png";
import busLeft from "../assets/bus-left.png";

const MapView = ({ location }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const mapRef = useRef(null);
  const lastLocationRef = useRef(null);
  const busIconRef = useRef(busRight); // holds latest orientation

  const [userLocation, setUserLocation] = useState(null);
  const [busIcon, setBusIcon] = useState(busRight);

  /** ------------------------------------------------------------------
   * Save map instance
   * ------------------------------------------------------------------ */
  const onLoad = (map) => {
    mapRef.current = map;
  };

  /** ------------------------------------------------------------------
   * Get user location ONCE
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
      },
      (err) => console.warn("GPS error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  /** ------------------------------------------------------------------
   * Determine BUS DIRECTION (no cascading renders)
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!location) return;

    const prev = lastLocationRef.current;
    if (!prev) {
      lastLocationRef.current = location;
      return;
    }

    const dx = location.lng - prev.lng;
    const newIcon = dx > 0 ? busRight : busLeft;

    // only update state when icon truly changes
    if (newIcon !== busIconRef.current) {
      busIconRef.current = newIcon;
      setBusIcon(newIcon);
    }

    lastLocationRef.current = location;
  }, [location]);

  /** ------------------------------------------------------------------
   * Auto-center ONCE on BUS when location first arrives
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!location || !mapRef.current) return;

    if (!mapRef.current._initialBusCentered) {
      mapRef.current.panTo(location);
      mapRef.current._initialBusCentered = true; // mark as centered
    }
  }, [location]);

  if (!isLoaded) return <p>Loading map…</p>;

  const fallback = { lat: 12.3043808, lng: 76.7041042 };

  return (
    <div className="map-fullscreen">
      <GoogleMap
        onLoad={onLoad}
        center={userLocation || location || fallback}
        zoom={13.5}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{
          clickableIcons: false,
          gestureHandling: "greedy",
          mapTypeControl: false,
        }}
      >
        {/* -----------------------------------------------
            ROUTE POLYLINE
        ------------------------------------------------ */}
        <Polyline
          path={routePolyline.path}
          options={{
            strokeColor: "#1E90FF",
            strokeWeight: 5,
            strokeOpacity: 0.9,
          }}
        />

        {/* -----------------------------------------------
            START POINT
        ------------------------------------------------ */}
        <Marker
          position={routeMeta.start_point}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#10B981",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          }}
        />

        {/* -----------------------------------------------
            END POINT
        ------------------------------------------------ */}
        <Marker
          position={routeMeta.end_point}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#EF4444",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          }}
        />

        {/* -----------------------------------------------
            STOPS → dots without labels
        ------------------------------------------------ */}
        {routeMeta.stops.map((stop) => (
          <Marker
            key={stop.id}
            position={{ lat: stop.lat, lng: stop.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "orange",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2,
            }}
          />
        ))}

        {/* -----------------------------------------------
            BUS MARKER
        ------------------------------------------------ */}
        {location && (
          <Marker
            position={location}
            icon={{
              url: busIcon,
              scaledSize: new window.google.maps.Size(42, 42),
            }}
          />
        )}

        {/* -----------------------------------------------
            USER LOCATION
        ------------------------------------------------ */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;
