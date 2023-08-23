"use client";
// Importing types, so we can use them in our code, but not load their implementation/behavior in the final js bundle.
import type { FindPlaceFromTextResponseData } from "@googlemaps/google-maps-services-js";

export default function NewRoutePage() {
  async function searchPlaces(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

    const directionsResponse = await fetch(`http://localhost:3000/directions?originId=${sourcePlaceId}&destinationId=${destinationPlaceId}`)
    const directionsData = await directionsResponse.json();

    console.log(directionsData);
  }
  // Values are hardcoded for simplicity.
  return (
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
          defaultValue={"Brasília Shopping - Asa Norte, Brasilia - Federal District"}
          placeholder="Destination"
        />
        <button type="submit">Create Route</button>
      </form>
    </div>
  );
}
