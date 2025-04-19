import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Car, Bike, Footprints, Locate, BusFront, TrainFront, Scooter, Taxi } from 'lucide-react';

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

const VEHICLES = [
  { key: 'driving-car', label: 'Car', icon: <Car className="inline mr-1" size={18} /> },
  { key: 'cycling-regular', label: 'Bike', icon: <Bike className="inline mr-1" size={18} /> },
  { key: 'foot-walking', label: 'Walking', icon: <Footprints className="inline mr-1" size={18} /> },
  { key: 'driving-hgv', label: 'Bus', icon: <BusFront className="inline mr-1" size={18} /> },
  { key: 'public-transport', label: 'Train', icon: <TrainFront className="inline mr-1" size={18} /> },
  { key: 'scooter', label: 'Scooter', icon: <Scooter className="inline mr-1" size={18} /> },
  { key: 'taxi', label: 'Taxi', icon: <Taxi className="inline mr-1" size={18} /> },
];

const mosqueIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2936/2936744.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const routeColors: Record<string, string> = {
  'driving-car': '#2563eb',
  'cycling-regular': '#22c55e',
  'foot-walking': '#f59e42',
  'driving-hgv': '#a21caf',
  'wheelchair': '#f43f5e',
  'public-transport': '#0ea5e9',
};

function RecenterButton({ position }: { position: LatLngExpression }) {
  const map = useMap();
  return (
    <button
      aria-label="Recenter map"
      className="absolute z-20 bottom-24 right-4 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 border border-gray-200 dark:border-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
      onClick={() => map.setView(position, 14)}
      style={{ outline: 'none' }}
    >
      <Locate className="text-primary-600 dark:text-primary-400" size={22} />
    </button>
  );
}


const MosqueMapPage: React.FC = () => {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [mosques, setMosques] = useState<any[]>([]);
  const [selectedMosque, setSelectedMosque] = useState<any | null>(null);
  const [vehicle, setVehicle] = useState(VEHICLES[0].key);
  const [route, setRoute] = useState<any>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [loadingMosques, setLoadingMosques] = useState(false);
  const [mosqueError, setMosqueError] = useState<string | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => setUserPos([31.7917, -7.0926]) // fallback: Morocco center
    );
  }, []);

  // Fetch mosques nearby using Overpass API
  useEffect(() => {
    if (!userPos) return;
    setLoadingMosques(true);
    setMosqueError(null);
    const [lat, lon] = userPos;
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="place_of_worship"]["religion"="muslim"](around:4000,${lat},${lon});
        way["amenity"="place_of_worship"]["religion"="muslim"](around:4000,${lat},${lon});
        relation["amenity"="place_of_worship"]["religion"="muslim"](around:4000,${lat},${lon});
      );
      out center;
    `;
    fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    })
      .then(res => res.json())
      .then(data => {
        setMosques(data.elements || []);
        setLoadingMosques(false);
      })
      .catch(() => {
        setMosqueError('Failed to load mosques nearby.');
        setLoadingMosques(false);
      });
  }, [userPos]);

  // Fetch route from user to mosque
  useEffect(() => {
    if (!userPos || !selectedMosque) return;
    setLoadingRoute(true);
    setRouteError(null);
    setRoute(null);
    const start = userPos;
    const end = [
      selectedMosque.lat || selectedMosque.center?.lat,
      selectedMosque.lon || selectedMosque.center?.lon,
    ];
    // Only supported vehicle types for ORS
    const supported = ['driving-car', 'cycling-regular', 'foot-walking', 'driving-hgv', 'public-transport'];
    if (!supported.includes(vehicle)) {
      setTimeout(() => {
        setRouteError('This transport mode is not supported yet.');
        setLoadingRoute(false);
      }, 400);
      return;
    }
    const url = `https://api.openrouteservice.org/v2/directions/${vehicle}?api_key=${ORS_API_KEY}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!data.features || !data.features[0]) {
          setRouteError('No route found.');
          setRoute(null);
        } else {
          setRoute(data.features[0]);
        }
        setLoadingRoute(false);
      })
      .catch(() => {
        setRouteError('Failed to fetch route.');
        setLoadingRoute(false);
      });
  }, [selectedMosque, vehicle, userPos]);

  return (
    <div className="relative w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Vehicle selector below navbar */}
      {/* Map fills the screen below the header */}
      {userPos && (
        <div className="w-full relative" style={{ height: 'calc(100vh - 4rem)' }}>
          {/* Vehicle selector overlay */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-[1000] bg-white dark:bg-gray-900 rounded-b-lg shadow px-4 py-2 flex gap-2 items-center">
            {VEHICLES.map(v => (
              <button
                key={v.key}
                onClick={() => setVehicle(v.key)}
                aria-label={v.label}
                className={`px-2 py-1 rounded flex items-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500
                  ${vehicle === v.key
                    ? 'bg-primary-600 text-white dark:bg-primary-400 dark:text-gray-900'
                    : 'bg-gray-200 text-primary-600 dark:bg-gray-800 dark:text-primary-300'}
                `}
              >
                <span className={vehicle === v.key ? 'text-white dark:text-gray-900' : 'text-primary-600 dark:text-primary-300'}>
                  {v.icon}
                </span>
                <span className="ml-1">{v.label}</span>
              </button>
            ))}
          </div>
          <MapContainer center={userPos} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={userPos} icon={userIcon}>
              <Popup>Your Location</Popup>
            </Marker>
            {!loadingMosques && mosques.length === 0 && (
              <></> /* Map will look empty, but we show a message below */
            )}
            {mosques.map((m, i) => (
              <Marker
                key={m.id || i}
                position={[m.lat || m.center?.lat, m.lon || m.center?.lon]}
                icon={mosqueIcon}
                eventHandlers={{ click: () => setSelectedMosque(m) }}
              >
                <Popup>
                  <div className="font-semibold text-primary-700 dark:text-primary-400 flex items-center">
                    🕌 {m.tags?.name || 'Unnamed Mosque'}
                  </div>
                  <div className="text-xs text-gray-700 dark:text-gray-200 mb-1">
                    {m.tags?.addr_full || m.tags?.['addr:street'] || m.tags?.['addr:city'] || ''}
                  </div>
                  <button
                    className="mt-2 px-3 py-1 rounded bg-primary-600 text-white hover:bg-primary-700 focus:outline-none"
                    onClick={() => setSelectedMosque(m)}
                  >
                    Go Here
                  </button>
                </Popup>
              </Marker>
            ))}
            {route && (
              <Polyline
                positions={route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng])}
                pathOptions={{ color: routeColors[vehicle] || 'blue', weight: 6, opacity: 0.7 }}
              />
            )}
            <RecenterButton position={userPos} />
          </MapContainer>
          {loadingMosques && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded shadow text-lg font-semibold text-primary-700 dark:text-primary-400">Loading mosques nearby...</div>
            </div>
          )}
          {mosqueError && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-red-100 dark:bg-red-900/90 p-6 rounded shadow text-lg font-semibold text-red-700 dark:text-red-200">{mosqueError}</div>
            </div>
          )}
          {!loadingMosques && mosques.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded shadow text-lg font-semibold text-gray-700 dark:text-gray-200">No mosques found nearby.</div>
            </div>
          )}
          {loadingRoute && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded shadow text-lg font-semibold text-primary-700 dark:text-primary-400">Loading route...</div>
            </div>
          )}
          {routeError && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-red-100 dark:bg-red-900/90 p-6 rounded shadow text-lg font-semibold text-red-700 dark:text-red-200">{routeError}</div>
            </div>
          )}
          {route && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-900/90 rounded-lg shadow px-4 py-2 z-10 flex flex-col items-center max-w-[95vw]">
              <div className="font-semibold">Route Info</div>
              <div>
                Distance: {((route.properties.segments[0].distance / 1000).toFixed(2))} km
              </div>
              <div>
                Duration: {Math.ceil(route.properties.segments[0].duration / 60)} min
              </div>
              {route.properties.segments[0].steps && (
                <details className="mt-2 w-full max-w-xs">
                  <summary className="cursor-pointer text-primary-700 dark:text-primary-300 font-medium">Turn-by-turn Directions</summary>
                  <ol className="text-xs mt-2 space-y-1 list-decimal list-inside">
                    {route.properties.segments[0].steps.map((step: any, idx: number) => (
                      <li key={idx} className="truncate">
                        {step.instruction}
                        {step.name ? ` (${step.name})` : ''}
                        {step.distance ? ` - ${step.distance.toFixed(0)}m` : ''}
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MosqueMapPage;
