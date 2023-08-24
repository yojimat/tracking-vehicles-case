"use client";
import useMap from "@/hooks/useMap";
import { Route } from "@/utils/models";
import { socket } from "@/utils/socket-io";
import { useEffect, useRef } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AdminPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainer);

  useEffect(() => {
    socket.connect();
    socket.on("admin-new-points", async (data: SocketPayload) => {
      // On the second call of the socket, the variable map lose its reference to the map object.
      if (map && !map.hasRoute(data.route_id)) {
        const response = await fetch(
          `http://localhost:3000/routes/${data.route_id}`
        );
        const route: Route = await response.json();

        await map?.addRouteWithIcons({
          routeId: data.route_id,
          startMarkerOptions: {
            position: route.directions.routes[0].legs[0].start_location,
          },
          endMarkerOptions: {
            position: route.directions.routes[0].legs[0].end_location,
          },
          carMarkerOptions: {
            position: route.directions.routes[0].legs[0].start_location,
          },
        });
      }
      map?.moveCar(data.route_id, { lat: data.lat, lng: data.lng });
    });

    return () => {
      socket.disconnect();
    };
  }, [map]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        id="map"
        style={{
          height: "100%",
          width: "100%",
        }}
        ref={mapContainer}
      ></div>
    </div>
  );
}

type SocketPayload = {
  route_id: string;
  lat: number;
  lng: number;
};
