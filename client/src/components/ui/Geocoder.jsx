import { useState, useCallback, useRef, useEffect } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function Geocoder({ onResult, placeholder }) {
  const geocoderRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || geocoderRef.current) return;

    // Create geocoder instance only once
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      types: "country,region,place,postcode,locality,neighborhood,address",
      placeholder: placeholder || "Search for a place",
      proximity: "ip", // Bias results to user's location
      countries: "IN", // Lock search to India
    });

    // Add event listener
    geocoder.on("result", (e) => {
      onResult(e.result);
    });

    // Add geocoder to container
    containerRef.current.appendChild(geocoder.onAdd());
    geocoderRef.current = geocoder;

    // Cleanup function
    return () => {
      if (geocoderRef.current) {
        geocoderRef.current.onRemove();
        geocoderRef.current = null;
      }
    };
  }, [onResult, placeholder]);

  return <div ref={containerRef} className="w-full" />;
}

export default Geocoder;
