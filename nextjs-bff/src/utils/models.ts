import type { DirectionsResponseData } from "@googlemaps/google-maps-services-js";

export type Location = {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
};

export type Route = {
  id: string;
  name: string;
  source: Location;
  destination: Location; 
  distance: number;
  duration: number;
  directions: DirectionsResponseData & { request: any };
  created_at: Date;
  updated_at: Date;
};
