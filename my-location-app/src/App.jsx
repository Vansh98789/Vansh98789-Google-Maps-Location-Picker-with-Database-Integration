import React, { useState } from 'react';
import { AddressProvider } from './context/AddressContext';
import Layout from './components/Layout';
import LocationPermissionModal from './components/LocationPermissionModal';
import MapSelection from './components/MapSelection';
import AddressForm from './components/AddressForm';
import SavedAddresses from './components/SavedAddresses';

export default function App() {
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [step, setStep] = useState('permission'); // 'permission', 'map', 'form', 'saved'

  const handleLocationEnabled = () => {
    setStep('map');
    setShowPermissionModal(false);
  };

  const handleLocationSelected = (location) => {
    setSelectedLocation(location);
    setStep('form');
  };

  const handleAddressSubmitted = () => {
    setStep('saved');
    setSelectedLocation(null);
  };

  const handleSelectSavedAddress = (address) => {
    console.log('Selected address:', address);
  };

  // Navigation controls
  const goToMap = () => {
    setStep('map');
    setShowPermissionModal(false);
  };

  const goToAddressForm = () => {
    setStep('form');
  };

  const goToSavedAddresses = () => {
    setStep('saved');
  };

  return (
    <AddressProvider>
      <Layout>
        {/* Navigation Bar */}
        <div className="bg-white shadow mb-6">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">Location Manager</h1>
              <div className="space-x-4">
                <button
                  onClick={goToMap}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Add New Address
                </button>
                <button
                  onClick={goToSavedAddresses}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                >
                  Saved Addresses
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step Progress Indicator */}
        {step !== 'saved' && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex justify-between items-center">
              <div className={`flex items-center ${step === 'map' || step === 'form' ? 'text-blue-500' : 'text-gray-400'}`}>
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">1</div>
                <span className="ml-2">Select Location</span>
              </div>
              <div className="flex-1 border-t-2 mx-4"></div>
              <div className={`flex items-center ${step === 'form' ? 'text-blue-500' : 'text-gray-400'}`}>
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">2</div>
                <span className="ml-2">Add Details</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-2xl mx-auto space-y-8">
          {showPermissionModal && (
            <LocationPermissionModal
              onClose={() => {
                setShowPermissionModal(false);
                setStep('map');
              }}
              onLocationEnabled={handleLocationEnabled}
            />
          )}

          {step === 'map' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Select Location</h2>
              <MapSelection onLocationSelect={handleLocationSelected} />
              <div className="mt-4 flex justify-between">
                <button
                  onClick={goToSavedAddresses}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => selectedLocation && goToAddressForm()}
                  disabled={!selectedLocation}
                  className={`px-4 py-2 text-sm text-white rounded transition ${
                    selectedLocation ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 'form' && selectedLocation && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Add Address Details</h2>
              <AddressForm
                selectedLocation={selectedLocation}
                onSubmit={handleAddressSubmitted}
                onBack={() => setStep('map')}
              />
            </div>
          )}

          {step === 'saved' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
              <SavedAddresses onSelectAddress={handleSelectSavedAddress} />
            </div>
          )}
        </div>
      </Layout>
    </AddressProvider>
  );
}