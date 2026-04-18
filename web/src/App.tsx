import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Camera } from './types';
import { fetchCameras } from './api';
import 'leaflet/dist/leaflet.css';

import { createDefaultIcon } from './utils';
import './App.css';

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14);
  }, [map, center]);
  return null;
}

export default function App() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  const loadCameras = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCameras();
      setCameras(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load cameras');
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
    loadCameras();
  }, [loadCameras]);

  useEffect(() => {
    if (!selectedCamera || !selectedCamera.imageUrl) return;
    
    setImageUrl(selectedCamera.imageUrl);
    setLastUpdated(new Date());
    setImageError(false);
    
    const interval = setInterval(() => {
      const timestamp = Date.now();
      setImageUrl(`${selectedCamera.imageUrl}?t=${timestamp}`);
      setLastUpdated(new Date());
    }, 3000);
    
    return () => clearInterval(interval);
  }, [selectedCamera]);

  const handleCameraClick = (camera: Camera) => {
    setSelectedCamera(camera);
  };

  const handleRefresh = () => {
    if (selectedCamera?.imageUrl) {
      const timestamp = Date.now();
      setImageUrl(`${selectedCamera.imageUrl}?r=${timestamp}`);
      setLastUpdated(new Date());
    }
  };

  const handleOpenBrowser = () => {
    if (selectedCamera) {
      window.open(selectedCamera.imageUrl, '_blank');
    }
  };

  const defaultCenter: [number, number] = [-33.8688, 151.2093];

  return (
    <div className="app">
      <header className="header">
        <h1>NSW Traffic Cameras</h1>
        <button onClick={loadCameras} disabled={loading} className="refresh-btn">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={loadCameras}>Retry</button>
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="map"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {cameras.map((camera) => (
          <Marker
            key={camera.id}
            position={[camera.latitude, camera.longitude]}
            eventHandlers={{
              click: () => handleCameraClick(camera),
            }}
            icon={createDefaultIcon()}
          />
        ))}
        
        {selectedCamera && (
          <MapController center={[selectedCamera.latitude, selectedCamera.longitude]} />
        )}
      </MapContainer>

      {selectedCamera && (
        <div className="bottom-sheet">
          <div className="bottom-sheet-header">
            <h2>{selectedCamera.title}</h2>
            <button className="close-btn" onClick={() => setSelectedCamera(null)}>×</button>
          </div>
          
          <p className="camera-description">{selectedCamera.description}</p>
          
          <div className="camera-info">
            <span>Direction: {selectedCamera.direction}</span>
            {lastUpdated && (
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>
          
          <div className="image-container">
            {imageLoading && <div className="image-loading">Loading...</div>}
            {!imageLoading && !imageError && imageUrl && (
              <img
                src={imageUrl}
                alt="Live camera feed"
                className="camera-image"
                onLoad={() => { setImageLoading(false); setImageError(false); }}
                onError={() => { setImageLoading(false); setImageError(true); }}
              />
            )}
            {imageError && (
              <div className="image-error">
                Camera unavailable
                <button onClick={handleRefresh}>Tap Refresh to retry</button>
              </div>
            )}
          </div>
          
          <div className="action-buttons">
            <button onClick={handleRefresh} className="btn btn-primary">
              Refresh
            </button>
            <button onClick={handleOpenBrowser} className="btn btn-secondary">
              Open in Browser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}