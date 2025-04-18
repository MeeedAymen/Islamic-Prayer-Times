import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lat: number, lon: number) => void;
}

const LocationPicker: React.FC<{onSelect: (lat: number, lon: number) => void}> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-2 md:p-4 relative w-full h-full md:max-w-3xl md:h-[600px] md:rounded-2xl md:shadow-2xl flex flex-col"
          style={{ maxWidth: '95vw', maxHeight: '95vh' }}
        >
          <button
            className="absolute top-3 right-3 z-10 text-gray-700 dark:text-gray-300 hover:text-red-500 bg-white dark:bg-gray-800 rounded-full shadow-md p-2 focus:outline-none"
            onClick={onClose}
            aria-label="Close map"
          >
            <span className="text-2xl">×</span>
          </button>
          <div className="flex-1 rounded-xl overflow-hidden">
            <MapContainer center={[31.7917, -7.0926]} zoom={5} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <LocationPicker onSelect={onSelect} />
            </MapContainer>
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">Click anywhere on the map to select a location.</div>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
