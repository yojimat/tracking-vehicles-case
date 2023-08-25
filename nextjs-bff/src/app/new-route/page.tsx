"use client";
import useMap from "@/hooks/useMap";
// Importing types, so we can use them in our code, but not load their implementation/behavior in the final js bundle.
import type {
  DirectionsResponseData,
  FindPlaceFromTextResponseData,
} from "@googlemaps/google-maps-services-js";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useRef, useState } from "react";

export default function NewRoutePage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainer);
  const [directionsData, setDirectionsData] = useState<
    DirectionsResponseData & { request: any }
  >();
  const [open, setOpen] = useState(false);

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

    setDirectionsData(directionsData);

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

  async function createRoute() {
    const button = document.getElementById("submitBtn");
    button?.setAttribute("disabled", "true");
    const startAddress = directionsData!.routes[0].legs[0].start_address;
    const endAddress = directionsData!.routes[0].legs[0].end_address;

    await fetch("http://localhost:3000/routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${startAddress} >>> ${endAddress}`,
        source_id: directionsData!.request.origin.place_id,
        destination_id: directionsData!.request.destination.place_id,
      }),
    });
    setOpen(true)
    button?.removeAttribute("disabled");
  }

  // Values are hardcoded for simplicity.
  return (
    <Grid2 container sx={{ display: "flex", flex: 1 }}>
      <Grid2 xs={4} px={2}>
        <Typography sx={{ mt: 2 }} variant="h4">
          New Route
        </Typography>
        <form onSubmit={searchPlaces}>
          <TextField
            id="source"
            type="text"
            sx={{ mt: 2 }}
            defaultValue={
              "Simpsons - SHIGS 706 Bl. D, Loja 35 - Asa Sul, Brasilia - Federal District"
            }
            fullWidth
            label="Start Location"
          />
          <TextField
            id="destination"
            type="text"
            sx={{ mt: 2 }}
            defaultValue={
              "Brasília Shopping - Asa Norte, Brasilia - Federal District"
            }
            fullWidth
            label="Destination"
          />
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            id="submitBtn"
            fullWidth
            type="submit"
          >
            Search Route
          </Button>
        </form>
        {directionsData && (
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary={"Start Location"}
                    secondary={directionsData.routes[0].legs[0].start_address}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Destination"}
                    secondary={directionsData.routes[0].legs[0].end_address}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Distance"}
                    secondary={directionsData.routes[0].legs[0].distance.text}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Duration"}
                    secondary={directionsData.routes[0].legs[0].duration.text}
                  />
                </ListItem>
              </List>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              <Button type="button" variant="contained" onClick={createRoute}>
                Create Route
              </Button>
            </CardActions>
          </Card>
        )}
      </Grid2>
      <Grid2 id="map" xs={8} ref={mapContainer}></Grid2>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity="success">
          Route registered successfully!
        </Alert>
      </Snackbar>
    </Grid2>
  );
}
