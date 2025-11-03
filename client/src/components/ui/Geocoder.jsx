import { useState, useCallback } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function Geocoder({ onResult, placeholder }) {
    const geocoder = new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        types: 'country,region,place,postcode,locality,neighborhood,address',
        placeholder: placeholder,
        proximity: 'ip', // Bias results to user's location
        countries: 'IN', // Lock search to India
    });

    const geocoderContainer = useCallback(node => {
        if (node !== null) {
            node.appendChild(geocoder.onAdd());
        }
    }, []);

    geocoder.on('result', (e) => {
        onResult(e.result);
    });

    return <div ref={geocoderContainer} className="w-full" />;
}

export default Geocoder;
