"use client";

import { Route } from "@/utils/models";
import { fetcher } from "@/utils/http";
import { NativeSelect, NativeSelectProps } from "@mui/material";
import useSwr from "swr";

export const RouteSelect = (props: NativeSelectProps) => {
  const {
    data: routes,
    error,
    isLoading,
  } = useSwr<Route[]>("http://localhost:3001/api/routes", fetcher, {
    fallbackData: [],
  });

  return (
    <NativeSelect {...props}  id="route">
      {isLoading && <option>Loading Routes</option>}
      {error && <option>Error Loading Routes</option>}
      {routes!.map((route: Route) => (
        <option key={route.id} value={route.id}>
          {route.name}
        </option>
      ))}
    </NativeSelect>
  );
};
