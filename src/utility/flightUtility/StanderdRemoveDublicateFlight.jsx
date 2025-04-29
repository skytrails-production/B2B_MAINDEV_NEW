export function findCheapestFlights(amadeusFlights) {
  const flightMap = new Map();

  // Helper function to extract flight info from Amadeus flights
  const extractFlightInfo = (flight) => {
    return {
      flightNumber: flight?.lightNumber,
      source: flight?.origin,
      destination: flight?.destination,
      timeOfDeparture: flight?.flightdepartureTime,

      timeOfArrival: flight?.arrivalTime,
    };
  };

  // Helper function to add or update flight in flightMap
  const addOrUpdateFlight = (flight) => {
    const {
      flightNumber,

      destination,
      timeOfDeparture,
      timeOfArrival,
      price,
    } = extractFlightInfo(flight);
    console.log();

    const key = `${flightNumber}-${timeOfDeparture}-${timeOfArrival}`;

    if (!flightMap.has(key)) {
      flightMap.set(key, { ...flight });
    } else {
      const existingFlight = flightMap.get(key);
      if (price < existingFlight.price) {
        flightMap.set(key, { ...flight });
      }
    }
  };

  // Add Amadeus flights
  amadeusFlights.forEach((flight) => addOrUpdateFlight(flight));

  const data = Array.from(flightMap.values());
  let sortedData = data.sort((a, b) => {
    return a.price - b.price;
  });
  return sortedData;
}
