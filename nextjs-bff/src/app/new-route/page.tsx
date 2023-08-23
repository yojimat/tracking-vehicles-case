"use client";
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

    const [sourcePlace, destinationPlace] = await Promise.all([
      sourceResponse.json(),
      destinationResponse.json(),
    ]);

    console.log(sourcePlace, destinationPlace);
  }

  return (
    <div>
      <h1>New Route</h1>
      <form
        onSubmit={searchPlaces}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div>
          <input id="source" type="text" placeholder="Start Location" />
        </div>
        <div>
          <input id="destination" type="text" placeholder="Destination" />
        </div>
        <button type="submit">Create Route</button>
      </form>
    </div>
  );
}
