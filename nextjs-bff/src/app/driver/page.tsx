"use client";

import { RouteSelect } from "@/components/RouteSelect";
import useMap from "@/hooks/useMap";
import { Route } from "@/utils/models";
import { socket } from "@/utils/socket-io";
import { Button, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useRef } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DriverPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainer);

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

    const routeId = select.value;
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
    <Grid2 container sx={{ display: "flex", flex: 1 }}>
      <Grid2 xs={4} px={2}>
        <Typography sx={{mt: 2}} variant="h4">Trip Simulator</Typography>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <RouteSelect />
          <Button
            variant="contained"
            id="submitBtn"
            sx={{ mt: 2 }}
            onClick={startRoute}
          >
            Start Trip
          </Button>
        </div>
      </Grid2>
      <Grid2 id="map" xs={8} ref={mapContainer}></Grid2>
    </Grid2>
  );
}
