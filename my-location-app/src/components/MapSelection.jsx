import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapSelection = ({ onLocationSelect }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const defaultCenter = {
    lat: 28.6139, 
    lng: 77.2090
  };

  // Initialize geocoder
  const getAddressFromLatLng = useCallback(async (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({
        location: { lat, lng }
      });
      if (response.results[0]) {
        setCurrentAddress(response.results[0].formatted_address);
        return response.results[0].formatted_address;
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
    return '';
  }, []);

  // Handle map click to place/move marker
  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    const address = await getAddressFromLatLng(lat, lng);
    onLocationSelect({ lat, lng, address });
  };

  // Handle "Use My Location" button click
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMarkerPosition({ lat, lng });
        const address = await getAddressFromLatLng(lat, lng);
        onLocationSelect({ lat, lng, address });
      }, (error) => {
        console.error('Error getting location:', error);
      });
    } else {
      console.error('Geolocation is not supported');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleUseMyLocation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Use My Location
        </button>
      </div>

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition || defaultCenter}
          zoom={15}
          onClick={handleMapClick}
        >
          {markerPosition && (
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={async (e) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                setMarkerPosition({ lat, lng });
                const address = await getAddressFromLatLng(lat, lng);
                onLocationSelect({ lat, lng, address });
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {currentAddress && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Selected Location:</h3>
          <p className="text-gray-600">{currentAddress}</p>
        </div>
      )}
    </div>
  );
};

export default MapSelection;