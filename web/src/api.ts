import { Camera, CameraApiResponse, CameraRecord } from './types';

const API_BASE = 'https://nsw-bayside.opendatasoft.com/api/records/1.0/search/';

export async function fetchCameras(): Promise<Camera[]> {
  const url = `${API_BASE}?dataset=live-traffic-cameras-sydney-metro&rows=100`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch cameras: ${response.status}`);
  }
  
  const data: CameraApiResponse = await response.json();
  return data.records.map(mapRecordToCamera);
}

function mapRecordToCamera(record: CameraRecord): Camera {
  const lat = record.fields.geo_point_2d?.[0] ?? record.geometry.coordinates[1] ?? 0;
  const lon = record.fields.geo_point_2d?.[1] ?? record.geometry.coordinates[0] ?? 0;
  
  return {
    id: record.recordid,
    title: record.fields.title,
    description: record.fields.view,
    latitude: lat,
    longitude: lon,
    direction: record.fields.direction ?? 'Unknown',
    imageUrl: record.fields.href ?? '',
    region: record.fields.region ?? 'SYD_MET'
  };
}