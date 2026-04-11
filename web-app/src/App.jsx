import React, { useState, useMemo, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Camera } from 'lucide-react';

import safetyData from './data/Street_safety_cameras.json';

// We use a free vector basemap style via MapTiler/Carto or MapLibre default
// This Carto Positron Dark style looks great with the 3D aesthetic
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// Polling timestamp interval hook for refreshing image to simulate live stream
function useImageRefresh(interval = 5000) {
  const [timestamp, setTimestamp] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setTimestamp(Date.now()), interval);
    return () => clearInterval(timer);
  }, [interval]);
  return timestamp;
}

function App() {
  const [popupInfo, setPopupInfo] = useState(null);
  const [dynamicTrafficCameras, setDynamicTrafficCameras] = useState([]);
  
  const timestamp = useImageRefresh(3000); // 3 sec refresh

  // Fetch Live Traffic Cameras from API
  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        const response = await fetch('https://nsw-bayside.opendatasoft.com/api/explore/v2.1/catalog/datasets/live-traffic-cameras-sydney-metro/records?limit=100');
        const data = await response.json();
        
        const mapped = data.results.map((r, i) => ({
          id: `traffic-api-${i}`,
          longitude: r.geo_point_2d.lon,
          latitude: r.geo_point_2d.lat,
          title: r.title || 'Traffic Camera',
          description: r.view || r.region,
          href: r.href,
          type: 'traffic'
        }));
        
        setDynamicTrafficCameras(mapped);
      } catch (error) {
        console.error("Failed to fetch traffic cameras:", error);
      }
    };
    
    fetchTrafficData();
  }, []);

  // Parse and memoize the data to optimize rendering
  const safetyCameras = useMemo(() => {
    return safetyData.features.filter(f => f.geometry && f.geometry.coordinates).map((f, i) => ({
      id: `safety-${i}`,
      longitude: f.geometry.coordinates[0],
      latitude: f.geometry.coordinates[1],
      title: f.properties.Location,
      description: `Safety Camera (${f.properties.Precinct})`,
      type: 'safety'
    }));
  }, []);

  const allCameras = useMemo(() => [...safetyCameras, ...dynamicTrafficCameras], [safetyCameras, dynamicTrafficCameras]);

  return (
    <>
      <header className="header">
        <Camera size={28} color="#38bdf8" />
        <h1>Sydney Camera Map</h1>
      </header>

      <Map
        initialViewState={{
          longitude: 151.2093,
          latitude: -33.8688,
          zoom: 14,
          pitch: 60, // Pitched by default for 3D look
          bearing: -20
        }}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
      >
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" visualizePitch={true} />

        {allCameras.map(camera => (
          <Marker
            key={camera.id}
            longitude={camera.longitude}
            latitude={camera.latitude}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(camera);
            }}
          >
            <div 
              className={`pulse-marker ${camera.type === 'safety' ? 'marker-safety' : 'marker-traffic'}`} 
            />
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            closeOnClick={false}
            closeButton={false}
          >
            <div onClick={() => setPopupInfo(null)} style={{cursor: 'pointer'}}>
              <h3 className="popup-title">{popupInfo.title}</h3>
              <p className="popup-desc">{popupInfo.description}</p>
              {popupInfo.href && (
                <div style={{ position: 'relative' }}>
                  <img 
                    className="popup-video"
                    src={`${popupInfo.href}?t=${timestamp}`} 
                    alt="Live Camera Feed"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="popup-timestamp">
                    Updated: {new Date(timestamp).toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
}

export default App;
