/**
 * Opens Google Maps app directly on mobile devices (or web browser on desktop)
 * with turn-by-turn navigation route targeting destination coordinates or address.
 *
 * @param {number|string} lat - Destination latitude
 * @param {number|string} lng - Destination longitude
 * @param {string} [address] - Optional destination address fallback if lat/lng missing
 * @returns {boolean} - true if opened, false otherwise
 */
export const openGoogleMapsDirections = (lat, lng, address = "") => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    let destinationQuery = "";

    const numLat = Number(lat);
    const numLng = Number(lng);

    const hasValidCoords = (
        lat !== undefined && lat !== null && lat !== "" &&
        lng !== undefined && lng !== null && lng !== "" &&
        !isNaN(numLat) && !isNaN(numLng) &&
        !(numLat === 0 && numLng === 0) &&
        Math.abs(numLat) <= 90 && Math.abs(numLng) <= 180
    );

    if (hasValidCoords) {
        destinationQuery = `${numLat},${numLng}`;
    } else if (address && address.trim()) {
        destinationQuery = encodeURIComponent(address.trim());
    } else {
        alert("Destination location is currently unavailable.");
        return false;
    }

    // Standard Universal Google Maps Directions Deep Link
    // Opens Native Google Maps App directly on iOS/Android if installed
    const universalUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}&travelmode=driving`;

    if (isMobile) {
        if (isAndroid && hasValidCoords) {
            // Android Native Google Maps Turn-by-Turn Navigation Intent
            const androidIntentUrl = `google.navigation:q=${numLat},${numLng}&mode=d`;
            window.location.href = androidIntentUrl;
            setTimeout(() => {
                window.location.href = universalUrl;
            }, 600);
        } else if (isIOS && hasValidCoords) {
            // iOS Google Maps App Scheme
            const iosSchemeUrl = `comgooglemaps://?daddr=${numLat},${numLng}&directionsmode=driving`;
            window.location.href = iosSchemeUrl;
            setTimeout(() => {
                window.location.href = universalUrl;
            }, 600);
        } else {
            window.location.href = universalUrl;
        }
    } else {
        window.open(universalUrl, "_blank", "noopener,noreferrer");
    }

    return true;
};
