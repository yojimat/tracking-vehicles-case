import { mapStyle, colors } from "@/styles/mapStyle";
import type { DirectionsResponseData } from "@googlemaps/google-maps-services-js";
import Route, { RouteExistsError } from "./route";
import { sample, shuffle } from "lodash";
import { makeCarIcon, makeMarkerIcon } from "./googleMapsFunctions";

export default class Map {
  public map: google.maps.Map;
  private routes: { [routeId: string]: Route } = {};

  constructor(element: HTMLElement, options: google.maps.MapOptions) {
    this.map = new google.maps.Map(element, {
      ...options,
      styles: mapStyle,
    });
  }

  async addRoute(routeOptions: RouteOptions) {
    if (routeOptions.routeId in this.routes) {
      throw new RouteExistsError("Route already exists");
    }

    const { startMarkerOptions, endMarkerOptions, carMarkerOptions } =
      routeOptions;

    const route = new Route({
      startMarkerOptions: { ...startMarkerOptions, map: this.map },
      endMarkerOptions: { ...endMarkerOptions, map: this.map },
      carMarkerOptions: { ...carMarkerOptions, map: this.map },
    });
    this.routes[routeOptions.routeId] = route;

    await route.calculateRoute(routeOptions.directionsResponseData);

    this.fitBounds();
  }

  async addRouteWithIcons(routeOptions: RouteOptionsWithoutIcon) {
    const color = sample(shuffle(colors)) as string;
    return this.addRoute({
      ...routeOptions,
      startMarkerOptions: {
        ...routeOptions.startMarkerOptions,
        icon: makeMarkerIcon(color),
      },
      endMarkerOptions: {
        ...routeOptions.endMarkerOptions,
        icon: makeMarkerIcon(color),
      },
      carMarkerOptions: {
        ...routeOptions.carMarkerOptions,
        icon: makeCarIcon(color),
      },
      directionsResponseData: routeOptions.directionsResponseData,
    });
  }

  private fitBounds() {
    const bounds = new google.maps.LatLngBounds();

    Object.keys(this.routes).forEach((id: string) => {
      const route = this.routes[id];
      bounds.extend(route.startMarker.getPosition()!);
      bounds.extend(route.endMarker.getPosition()!);
    });

    this.map.fitBounds(bounds);
  }

  moveCar(routeId: string, position: google.maps.LatLngLiteral) {
    this.routes[routeId].carMarker.setPosition(position);
  }

  removeRoute(id: string) {
    if (!this.hasRoute(id)) {
      return;
    }
    const route = this.routes[id];
    route.delete();
    delete this.routes[id];
  }

  removeAllRoutes() {
    Object.keys(this.routes).forEach((id) => this.removeRoute(id));
  }

  hasRoute(id: string) {
    return id in this.routes;
  }

  getRoute(id: string) {
    return this.routes[id];
  }
}

type RouteOptions = {
  routeId: string;
  startMarkerOptions: google.maps.MarkerOptions;
  endMarkerOptions: google.maps.MarkerOptions;
  carMarkerOptions: google.maps.MarkerOptions;
  directionsResponseData?: DirectionsResponseData & {
    request: any;
  };
};

type RouteOptionsWithoutIcon = {
  routeId: string;
  startMarkerOptions: Omit<google.maps.MarkerOptions, "icon">;
  endMarkerOptions: Omit<google.maps.MarkerOptions, "icon">;
  carMarkerOptions: Omit<google.maps.MarkerOptions, "icon">;
  directionsResponseData?: DirectionsResponseData & {
    request: any;
  };
};
