import React from 'react';
import { MapPin } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

export default function LocationPermissionModal({ onClose, onLocationEnabled }) {
  const { getCurrentLocation, loading, error } = useGeolocation();

  const handleEnableLocation = async () => {
    getCurrentLocation();
    if (!error) {
      onLocationEnabled();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">
            Enable Location Services
          </h3>
          
          <p className="text-gray-600 mb-6">
            Allow us to use your location to provide better delivery service and accurate address information.
          </p>
          
          {error && (
            <p className="text-red-500 mb-4">
              {error}
            </p>
          )}
          
          <div className="space-y-3">
            <button
              onClick={handleEnableLocation}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Enabling...' : 'Enable Location'}
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Search Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}