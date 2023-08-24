"use client";
import useMap from "@/hooks/useMap";
import { fetcher } from "@/utils/http";
import { Route } from "@/utils/models";
import { socket } from "@/utils/socket-io";
import { useEffect, useRef } from "react";
import useSwr from "swr";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DriverPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainer);

  const {
    data: routes,
    error,
    isLoading,
  } = useSwr<Route[]>("http://localhost:3000/routes", fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  async function startRoute() {
    const button = document.getElementById("submitBtn") as HTMLButtonElement;
    const select = document.getElementById("route") as HTMLSelectElement;
    button.setAttribute("disabled", "true");
    select.setAttribute("disabled", "true");

    const routeId = (document.getElementById("route") as HTMLSelectElement)
      .value;
    const response = await fetch(`http://localhost:3000/routes/${routeId}`);
    const route: Route = await response.json();
    map?.removeAllRoutes();
    await map?.addRouteWithIcons({
      routeId: routeId,
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
    const { steps } = route.directions.routes[0].legs[0];

    for (const step of steps) {
      await sleep(2000);
      map?.moveCar(routeId, step.start_location);
      socket.emit("new-points", {
        route_id: routeId,
        lat: step.start_location.lat,
        lng: step.start_location.lng,
      });

      await sleep(2000);
      map?.moveCar(routeId, step.end_location);
      socket.emit("new-points", {
        route_id: routeId,
        lat: step.end_location.lat,
        lng: step.end_location.lng,
      });
    }
    button.removeAttribute("disabled");
    select.removeAttribute("disabled");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ width: "25%" }}>
        <h1>Trip Simulator</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <select id="route">
            {isLoading && <option>Loading Routes</option>}
            {error && <option>Error Loading Routes</option>}
            {routes!.map((route: Route) => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
          <button id="submitBtn" type="submit" onClick={startRoute}>
            Start Trip
          </button>
        </div>
      </div>
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
