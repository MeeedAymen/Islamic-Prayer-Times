import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Car, Bike, Footprints, Locate, BusFront, TrainFront, TramFront, Truck } from 'lucide-react';
import ZoomControls from '../components/ZoomControls';
import { haversineDistance } from '../utils/distance';

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

const VEHICLES = [
  { key: 'driving-car', label: 'Car', icon: <Car className="inline mr-1" size={18} /> },
  { key: 'cycling-regular', label: 'Bike', icon: <Bike className="inline mr-1" size={18} /> },
  { key: 'foot-walking', label: 'Walking', icon: <Footprints className="inline mr-1" size={18} /> },
  { key: 'driving-hgv', label: 'Bus', icon: <BusFront className="inline mr-1" size={18} /> },
  { key: 'public-transport', label: 'Train', icon: <TrainFront className="inline mr-1" size={18} /> },
  { key: 'tram', label: 'Tram', icon: <TramFront className="inline mr-1" size={18} /> },
  { key: 'truck', label: 'Truck', icon: <Truck className="inline mr-1" size={18} /> },
];

const routeColors: Record<string, string> = {
  'driving-car': '#2563eb', // Blue
  'cycling-regular': '#22c55e', // Green
  'foot-walking': '#f59e42', // Orange
  'driving-hgv': '#a21caf', // Purple
  'wheelchair': '#f43f5e', // Pink
  'public-transport': '#0ea5e9', // Sky blue
  'tram': '#eab308', // Yellow
  'truck': '#6d28d9', // Indigo
};

const mosqueIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/5195/5195095.png', // Flaticon tower/minaret icon (new)
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const userArrowIcon = (angle: number) => new L.DivIcon({
  className: '',
  html: `<img src="/send-arrow.png" style="width:36px;height:36px;transform:rotate(${angle}deg);transition:transform 0.2s;" />`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});


function RecenterButton({ position }: { position: LatLngExpression }) {
  const map = useMap();
  return (
    <div className="absolute right-4 bottom-24 z-[1100]">
      <button
        aria-label="Recenter map"
        className="w-10 h-10 flex items-center justify-center rounded-full shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 text-primary-600 dark:text-primary-400 transition-colors"
        onClick={() => map.setView(position, 14)}
        style={{ outline: 'none' }}
      >
        <Locate size={22} />
      </button>
    </div>
  );
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MosqueMapPage: React.FC = () => {
  return <MosqueMapContent />;
};

export default MosqueMapPage;

// Extract the current content of MosqueMapPage into MosqueMapContent to avoid double logic
const MosqueMapContent: React.FC = () => {
  // New: Heading state for device orientation
  const [heading, setHeading] = useState<number | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [mosques, setMosques] = useState<any[]>([]);
  const [selectedMosque, setSelectedMosque] = useState<any | null>(null);
  const [vehicle, setVehicle] = useState(VEHICLES[0].key);
  const [route, setRoute] = useState<any>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [loadingMosques, setLoadingMosques] = useState(false);
  
  const [routeError, setRouteError] = useState<string | null>(null);

  // Listen for device orientation using Generic Sensor API (with fallback)
  useEffect(() => {
    let sensor: any = null;
    let fallbackListener: any = null;
    // Try Generic Sensor API first
    if ('AbsoluteOrientationSensor' in window) {
      // @ts-ignore
      sensor = new (window as any).AbsoluteOrientationSensor({ frequency: 60 });
      sensor.addEventListener('reading', () => {
        // sensor.quaternion is a Float32Array [x, y, z, w]
        const q = sensor.quaternion;
        // Convert quaternion to yaw (compass heading in degrees)
        // https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
        const ysqr = q[1] * q[1];
        // yaw (z-axis rotation)
        const t3 = +2.0 * (q[3] * q[2] + q[0] * q[1]);
        const t4 = +1.0 - 2.0 * (ysqr + q[2] * q[2]);
        let yaw = Math.atan2(t3, t4) * (180 / Math.PI);
        if (yaw < 0) yaw += 360;
        setHeading(yaw);
      });
      sensor.addEventListener('error', (_: any) => {
        // Fallback to deviceorientation if sensor fails
        fallbackListener = (_: DeviceOrientationEvent) => {
          let compassHeading: number | null = null;
          //@ts-ignore: webkitCompassHeading is for iOS Safari
          if (typeof (_ as any).webkitCompassHeading === 'number') {
            compassHeading = (_ as any).webkitCompassHeading;
          } else if (typeof _.alpha === 'number') {
            compassHeading = 360 - _.alpha;
          }
          if (typeof compassHeading === 'number' && !isNaN(compassHeading)) {
            setHeading(compassHeading);
          }
        };
        window.addEventListener('deviceorientation', fallbackListener, true);
      });
      sensor.start();
    } else {
      // Fallback: deviceorientation
      fallbackListener = (_: DeviceOrientationEvent) => {
        let compassHeading: number | null = null;
        // @ts-ignore: webkitCompassHeading is for iOS Safari
        if (typeof (_ as any).webkitCompassHeading === 'number') {
          compassHeading = (_ as any).webkitCompassHeading;
        } else if (typeof _.alpha === 'number') {
          compassHeading = 360 - _.alpha;
        }
        if (typeof compassHeading === 'number' && !isNaN(compassHeading)) {
          setHeading(compassHeading);
        }
      };
      window.addEventListener('deviceorientation', fallbackListener, true);
    }
    return () => {
      if (sensor && sensor.stop) sensor.stop();
      if (fallbackListener) window.removeEventListener('deviceorientation', fallbackListener, true);
    };
  }, []);

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
    setRouteError(null);
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
        setRouteError('Failed to load mosques nearby.');
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
    let apiVehicle = vehicle;
if (vehicle === 'truck') {
  apiVehicle = 'driving-car';
}
const supported = ['driving-car', 'cycling-regular', 'foot-walking', 'driving-hgv', 'public-transport'];
if (!supported.includes(apiVehicle)) {
  setTimeout(() => {
    setRouteError('This transport mode is not supported yet.');
    setLoadingRoute(false);
  }, 400);
  return;
}
const url = `https://api.openrouteservice.org/v2/directions/${apiVehicle}?api_key=${ORS_API_KEY}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;
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
      {/* Subtract header (4rem) and mobile navbar (3.5rem = 56px) for mobile */}
      {userPos && (
        <div className="w-full relative" style={{ height: 'calc(100vh - 4rem - 56px)' }}>
          {/* Vehicle selector overlay */}
          <div className="absolute top-0 left-0 right-0 z-[1000] flex flex-col items-center px-0 pt-0 overflow-x-hidden">
            <div className="w-full flex justify-start md:justify-center">
              <div className="bg-white/70 dark:bg-gray-800/70 shadow w-full md:w-auto md:rounded-b-lg gap-2 items-center px-2 py-2 flex md:inline-flex">
                {VEHICLES.map(v => (
                  <button
                    key={v.key}
                    onClick={() => setVehicle(v.key)}
                    aria-label={v.label}
                    className={`px-2 py-1 rounded flex items-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500
                      ${vehicle === v.key
                        ? 'bg-primary-600 text-white shadow'
                        : 'bg-white dark:bg-gray-900 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800'}
                    `}
                  >
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
            </div>
            {route && route.properties && route.properties.segments && route.properties.segments[0] && (
              <div className="mt-2 text-center text-primary-700 dark:text-primary-300 font-semibold text-sm bg-white/90 dark:bg-gray-900/90 rounded px-3 py-1 shadow">
                Estimated time: {Math.ceil(route.properties.segments[0].duration / 60)} min
              </div>
            )}
          </div>
          <MapContainer center={userPos} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ZoomControls />
            {/* Show arrow icon and rotation if on route, else normal icon */}
            {(() => {
              // If we have a heading (device orientation), use it for the arrow icon
              if (userPos && typeof heading === 'number') {
                return (
                  <Marker
                    position={userPos}
                    icon={userArrowIcon(heading)}
                  >
                    <Popup>Your Location (Compass)</Popup>
                  </Marker>
                );
              }
              // Otherwise, fallback to route-based direction if available
              try {
                if (
                  route &&
                  route.geometry &&
                  Array.isArray(route.geometry.coordinates) &&
                  route.geometry.coordinates.length > 1 &&
                  userPos &&
                  typeof userPos[0] === 'number' &&
                  typeof userPos[1] === 'number'
                ) {
                  // ORS: [lng, lat], Leaflet: [lat, lng]
                  const [userLat, userLng] = userPos;
                  const [nextLng, nextLat] = route.geometry.coordinates[1];
                  if (
                    typeof nextLat === 'number' &&
                    typeof nextLng === 'number'
                  ) {
                    const dx = nextLng - userLng;
                    const dy = nextLat - userLat;
                    const angleRad = Math.atan2(dx, dy);
                    const angleDeg = angleRad * (180 / Math.PI);
                    return (
                      <Marker
                        position={userPos}
                        icon={userArrowIcon(angleDeg)}
                      >
                        <Popup>Your Location (On Route)</Popup>
                      </Marker>
                    );
                  }
                }
              } catch (e) {
                // ignore
              }
              // Fallback to normal icon
              return (
                <Marker position={userPos} icon={userIcon}>
                  <Popup>Your Location</Popup>
                </Marker>
              );
            })()}
            {route && route.geometry && Array.isArray(route.geometry.coordinates) && (
              <Polyline
                positions={route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng])}
                pathOptions={{ color: routeColors[vehicle] || '#2563eb', weight: 6, opacity: 0.7 }}
              />
            )}
            {mosques.map((m, i) => {
              const popupRef = React.createRef<any>();
              return (
                <Marker
                  key={m.id || i}
                  position={[m.lat || m.center?.lat, m.lon || m.center?.lon]}
                  icon={mosqueIcon}
                >
                  <Popup ref={popupRef}>
                    <div className="font-semibold text-primary-700 dark:text-primary-400 flex items-center">
                      🕌 {m.tags?.name || m.tags?.['name:en'] || m.tags?.['name:ar'] || m.tags?.['name:fr'] || 'Unnamed Mosque'}
                    </div>
                    {(m.tags?.['addr:street'] || m.tags?.['addr:city']) && (
                      <div className="text-xs text-gray-700 dark:text-gray-200 mb-1">
                        {m.tags?.['addr:street']}{m.tags?.['addr:street'] && m.tags?.['addr:city'] ? ', ' : ''}{m.tags?.['addr:city']}
                      </div>
                    )}
                    {/* Show distance if userPos is available */}
                    {userPos && (
                      <div className="text-xs text-primary-600 dark:text-primary-400 mb-1 font-medium">
                        Distance: {(() => {
                          const lat1 = userPos[0];
                          const lon1 = userPos[1];
                          const lat2 = m.lat || m.center?.lat;
                          const lon2 = m.lon || m.center?.lon;
                          if (
                            typeof lat1 === 'number' && typeof lon1 === 'number' &&
                            typeof lat2 === 'number' && typeof lon2 === 'number'
                          ) {
                            const dist = haversineDistance(lat1, lon1, lat2, lon2);
                            return dist > 1000 ? `${(dist / 1000).toFixed(2)} km` : `${dist.toFixed(0)} m`;
                          }
                          return '?';
                        })()}
                      </div>
                    )}
                    {/* Show estimated time if this mosque is selected and route is available */}
                    {selectedMosque && ((m.lat || m.center?.lat) === (selectedMosque.lat || selectedMosque.center?.lat)) && ((m.lon || m.center?.lon) === (selectedMosque.lon || selectedMosque.center?.lon)) && (
                      route && route.properties && route.properties.segments && route.properties.segments[0] ? (
                        <span className="block text-xs text-primary-700 dark:text-primary-300 font-normal mt-1">
                          Estimated time: {Math.ceil(route.properties.segments[0].duration / 60)} min
                        </span>
                      ) : (
                        <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-1">
                          Estimated time not available for this vehicle.
                        </span>
                      )
                    )}
                    <button
                      className="mt-2 px-3 py-1 rounded bg-primary-600 text-white hover:bg-primary-700 focus:outline-none"
                      onClick={() => {
                        setSelectedMosque(m);
                        if (popupRef.current) {
                          if (typeof popupRef.current._close === 'function') popupRef.current._close();
                          if (typeof popupRef.current.close === 'function') popupRef.current.close();
                        }
                      }}
                    >
                      Go Here
                    </button>
                  </Popup>
                </Marker>
              );
            })}
            <RecenterButton position={userPos} />
          </MapContainer>
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

