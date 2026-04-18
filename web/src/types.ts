export interface Camera {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  direction: string;
  imageUrl: string;
  region: string;
}

export interface CameraApiResponse {
  nhits: number;
  records: {
    recordid: string;
    fields: {
      title: string;
      geo_point_2d?: [number, number];
      view: string;
      direction?: string;
      href?: string;
      region?: string;
    };
    geometry: {
      coordinates: [number, number];
    };
  }[];
}

export interface CameraRecord {
  recordid: string;
  fields: {
    title: string;
    geo_point_2d?: [number, number];
    view: string;
    direction?: string;
    href?: string;
    region?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}