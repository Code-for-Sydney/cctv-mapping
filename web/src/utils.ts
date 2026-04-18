import L from 'leaflet';

export const createDefaultIcon = (): L.Icon => {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41" width="25" height="41">
      <path fill="#1565C0" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="white" cx="12.5" cy="12.5" r="6"/>
    </svg>
  `;
  const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgIcon)}`;
  
  return L.icon({
    iconUrl: svgDataUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};