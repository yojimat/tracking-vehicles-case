export default function getCurrentPosition(
  options?: PositionOptions
): Promise<{ lat: number; lng: number }> {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        res({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      (error) => rej(error),
      options
    );
  });
}
