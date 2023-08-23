"use client";
import useMap from "@/hooks/useMap";
// Importing types, so we can use them in our code, but not load their implementation/behavior in the final js bundle.
import type {
  DirectionsResponseData,
  FindPlaceFromTextResponseData,
} from "@googlemaps/google-maps-services-js";
import { useRef } from "react";

export default function NewRoutePage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainer);

  async function searchPlaces(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const button = document.getElementById("submitBtn");
    button?.setAttribute("disabled", "true");
    const form = event.currentTarget;
    const source = form.source.value;
    const destination = form.destination.value;

    const [sourceResponse, destinationResponse] = await Promise.all([
      fetch(`http://localhost:3000/places?text=${source}`),
      fetch(`http://localhost:3000/places?text=${destination}`),
    ]);

    const [sourcePlace, destinationPlace]: FindPlaceFromTextResponseData[] =
      await Promise.all([sourceResponse.json(), destinationResponse.json()]);

    if (sourcePlace.status !== "OK") {
      console.error(sourcePlace);
      alert("The starting location was not found");
      return;
    }
    if (destinationPlace.status !== "OK") {
      console.error(destinationPlace);
      alert("The destination was not found");
      return;
    }

    const sourcePlaceId = sourcePlace.candidates[0].place_id;
    const destinationPlaceId = destinationPlace.candidates[0].place_id;

    const directionsResponse = await fetch(
      `http://localhost:3000/directions?originId=${sourcePlaceId}&destinationId=${destinationPlaceId}`
    );

    const directionsData: DirectionsResponseData & { request: any } =
      await directionsResponse.json();

    await map?.addRouteWithIcons({
      routeId: "1",
      startMarkerOptions: {
        position: directionsData.routes[0].legs[0].start_location,
      },
      endMarkerOptions: {
        position: directionsData.routes[0].legs[0].end_location,
      },
      carMarkerOptions: {
        position: directionsData.routes[0].legs[0].start_location,
      },
    });

    button?.removeAttribute("disabled");
  }
  // Values are hardcoded for simplicity.
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
      }}
    >
      <div>
        <h1>New Route</h1>
        <form
          onSubmit={searchPlaces}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <input
            id="source"
            type="text"
            defaultValue={
              "Simpsons - SHIGS 706 Bl. D, Loja 35 - Asa Sul, Brasilia - Federal District"
            }
            placeholder="Start Location"
          />
          <input
            id="destination"
            type="text"
            defaultValue={
              "Brasília Shopping - Asa Norte, Brasilia - Federal District"
            }
            placeholder="Destination"
          />
          <button id="submitBtn" type="submit">
            Create Route
          </button>
        </form>
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
