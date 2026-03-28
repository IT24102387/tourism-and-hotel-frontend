import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

// Sample destinations around Kataragama
const sampleDestinations = [
  {
    id: 1,
    name: 'Ruhunu Maha Kataragama Devalaya',
    position: { lat: 6.41433, lng: 81.33267 },
    description: 'Main shrine dedicated to the God Kataragama',
  },
  {
    id: 2,
    name: 'Kataragama Kiri Vehera',
    position: { lat: 6.4122, lng: 81.3328 },
    description: 'Ancient Buddhist stupa',
  },
  {
    id: 3,
    name: 'Menik Ganga (River of Gems)',
    position: { lat: 6.41139, lng: 81.33096 },
    description: 'Sacred river for ritual baths',
  },
  {
    id: 4,
    name: 'Sella Kataragama Temple',
    position: { lat: 6.40889, lng: 81.3225 },
    description: 'Temple dedicated to Valli Amma',
  },
  {
    id: 5,
    name: 'Wedasity Kanda',
    position: { lat: 6.38333, lng: 81.46667 },
    description: 'Sacred peak with panoramic views',
  },
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '500px',
  borderRadius: '16px',
};

const center = {
  lat: 6.41433,
  lng: 81.33267,
};

// Get API key from Vite environment variables
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const GoogleMapComponent = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [directions, setDirections] = useState(null);
  const mapRef = useRef();

  // Log to verify the key is loaded (but not shown in console)
  console.log('Map API key loaded:', googleMapsApiKey ? '✅ yes' : '❌ no');

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    // Optional: fit bounds to show all markers
    const bounds = new window.google.maps.LatLngBounds();
    sampleDestinations.forEach((dest) => bounds.extend(dest.position));
    map.fitBounds(bounds);
  }, []);

  const showRoute = useCallback(() => {
    if (!mapRef.current) return;

    const directionsService = new window.google.maps.DirectionsService();
    const waypoints = sampleDestinations.slice(1, -1).map((dest) => ({
      location: dest.position,
      stopover: true,
    }));

    directionsService.route(
      {
        origin: sampleDestinations[0].position,
        destination: sampleDestinations[sampleDestinations.length - 1].position,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
        } else {
          console.error('Directions request failed: ', status);
        }
      }
    );
  }, []);

  if (!googleMapsApiKey) {
    return <div style={{ padding: '20px', color: 'red' }}>⚠️ Google Maps API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.</div>;
  }

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={['places', 'directions']}
    >
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontFamily: "'Poppins', sans-serif" }}>🗺️ Sample Route Map</h2>
          <button
            onClick={showRoute}
            style={{
              background: '#FF9A3C',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '24px',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Show Optimized Route
          </button>
        </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
        >
          {/* Markers */}
          {sampleDestinations.map((dest) => (
            <Marker
              key={dest.id}
              position={dest.position}
              onClick={() => setSelectedMarker(dest)}
            />
          ))}

          {/* InfoWindow */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div style={{ padding: '8px', maxWidth: '200px' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{selectedMarker.name}</h4>
                <p style={{ margin: 0, fontSize: '12px' }}>{selectedMarker.description}</p>
              </div>
            </InfoWindow>
          )}

          {/* Directions (if route is generated) */}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default GoogleMapComponent;