import { useState, useEffect, useCallback } from 'react';

const INDORE_DEFAULT = {
    lat: 22.7196,
    lng: 75.8577,
    formattedAddress: "Vijay Nagar, Indore, Madhya Pradesh",
    city: "Indore",
    area: "Vijay Nagar"
};

export default function useCurrentLocation() {
    const [location, setLocation] = useState(INDORE_DEFAULT);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    const detectLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true);
        setError(null);
        setPermissionDenied(false);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                try {
                    // Try reverse geocoding via OpenStreetMap Nominatim
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await res.json();
                    
                    const area = data.address?.suburb || data.address?.neighbourhood || data.address?.road || "Current Area";
                    const city = data.address?.city || data.address?.town || data.address?.state_district || "Indore";
                    const formattedAddress = data.display_name || `${area}, ${city}`;

                    setLocation({
                        lat,
                        lng,
                        formattedAddress,
                        city,
                        area
                    });
                } catch (geoErr) {
                    setLocation({
                        lat,
                        lng,
                        formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
                        city: "Indore",
                        area: "Current Location"
                    });
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.warn("[GEOLOCATION WARN]", err.message);
                if (err.code === err.PERMISSION_DENIED) {
                    setPermissionDenied(true);
                    setError("Location permission denied. Please enable location in browser settings.");
                } else {
                    setError("Unable to detect location. Using Indore default.");
                }
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    }, []);

    useEffect(() => {
        detectLocation();
    }, [detectLocation]);

    return { location, loading, error, permissionDenied, detectLocation };
}
