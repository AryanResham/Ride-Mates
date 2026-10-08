import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { CITIES } from "../../utils/cities";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Location input. With a Mapbox token it renders the Mapbox geocoder (free-text search);
// without one it falls back to a city picker so the app works with zero configuration.
// Either way onResult receives { place_name, center: [lng, lat] }.
function Geocoder({ onResult, placeholder, value }) {
  if (MAPBOX_TOKEN) {
    return <MapboxGeocoderInput onResult={onResult} placeholder={placeholder} />;
  }
  return <CityPicker onResult={onResult} placeholder={placeholder} value={value} />;
}

function CityPicker({ onResult, placeholder, value }) {
  const [selected, setSelected] = useState(value?.place_name || "");

  useEffect(() => {
    setSelected(value?.place_name || "");
  }, [value]);

  const handleChange = (e) => {
    const name = e.target.value;
    setSelected(name);
    const city = CITIES.find((c) => c.name === name);
    onResult(city ? { place_name: city.name, center: city.center } : null);
  };

  return (
    <div className="relative">
      <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <select
        value={selected}
        onChange={handleChange}
        className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/60 pl-9 pr-3 text-gray-800 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition appearance-none"
      >
        <option value="">{placeholder || "Select a city"}</option>
        {CITIES.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function MapboxGeocoderInput({ onResult, placeholder }) {
  const geocoderRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || geocoderRef.current) return;
    let cancelled = false;

    (async () => {
      const [{ default: MapboxGeocoder }] = await Promise.all([
        import("@mapbox/mapbox-gl-geocoder"),
        import("@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"),
      ]);
      if (cancelled || !containerRef.current) return;

      const geocoder = new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        types: "country,region,place,postcode,locality,neighborhood,address",
        placeholder: placeholder || "Search for a place",
        proximity: "ip",
        countries: "IN",
      });
      geocoder.on("result", (e) => onResult(e.result));
      geocoder.on("clear", () => onResult(null));
      containerRef.current.appendChild(geocoder.onAdd());
      geocoderRef.current = geocoder;
    })();

    return () => {
      cancelled = true;
      if (geocoderRef.current) {
        geocoderRef.current.onRemove();
        geocoderRef.current = null;
      }
    };
  }, [onResult, placeholder]);

  return <div ref={containerRef} className="w-full" />;
}

export default Geocoder;
