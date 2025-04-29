// Function to format date-time into 'DD-MM-YYYY HH:mm'
const convertAmadeusTime = (dateOfDeparture, timeOfDeparture) => {
  // Parsing the first date-time
  let day = dateOfDeparture.slice(0, 2);
  let month = dateOfDeparture.slice(2, 4);
  let year = "20" + dateOfDeparture.slice(4, 6);

  let formattedDate = `${year}-${month}-${day}`;
  let formattedTime = `${timeOfDeparture.slice(0, 2)}:${timeOfDeparture.slice(
    2,
    4
  )}`;

  return `${formattedDate} ${formattedTime}`;
};
//     const formatDateTime = (dateTimeStr) => {
//     console.log(dateTimeStr,"dateTimeStr")

//     if (!dateTimeStr) return '';

//     const date = new Date(dateTimeStr);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//     const year = date.getFullYear();
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');

//     return `${day}-${month}-${year} ${hours}:${minutes}`;
//   };
// const formatDateTime = (date) => {
//     // console.log("jjjj")
//     if (!date || !(date instanceof Date)) return '';

//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');

//     return `${day}-${month}-${year} ${hours}:${minutes}`;
//   };
const convertTBOTime = (DDate) => {
  if (!DDate) return "";

  // Parsing the second date-time and formatting
  let date = new Date(DDate);

  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  let day = String(date.getDate()).padStart(2, "0");

  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
//   const convertKafilaTime = (dateStr) => {
//     if (!dateStr) return '';

//     const date = new Date(dateStr);
//     return formatDateTime(date);
//   };

export function findCheapestFlights(amadeusFlights, filteredFlights) {
  const flightMap = new Map();

  // Helper function to extract flight info from Amadeus flights
  const extractAmadeusFlightInfo = (flight) => {
    return {
      flightNumber:
        flight?.flightDetails?.flightInformation?.flightOrtrainNumber ||
        flight?.flightDetails?.[0]?.flightInformation?.flightOrtrainNumber,
      source:
        flight?.flightDetails?.flightInformation?.location?.[0]?.locationId ||
        flight.flightDetails?.[0]?.flightInformation?.location?.[0]?.locationId,
      destination:
        flight?.flightDetails?.flightInformation?.location?.[1]?.locationId ||
        flight?.flightDetails?.[flight?.flightDetails?.length - 1]
          ?.flightInformation?.location?.[1]?.locationId,
      timeOfDeparture: convertAmadeusTime(
        flight?.flightDetails?.flightInformation?.productDateTime
          ?.dateOfDeparture ||
          flight?.flightDetails?.[0]?.flightInformation?.productDateTime
            ?.dateOfDeparture,
        flight?.flightDetails?.flightInformation?.productDateTime
          ?.timeOfDeparture ||
          flight?.flightDetails?.[0]?.flightInformation?.productDateTime
            ?.timeOfDeparture
      ),

      timeOfArrival: convertAmadeusTime(
        flight?.flightDetails?.flightInformation?.productDateTime
          ?.dateOfArrival ||
          flight?.flightDetails?.[flight?.flightDetails?.length - 1]
            ?.flightInformation?.productDateTime?.dateOfArrival,
        flight?.flightDetails?.flightInformation?.productDateTime
          ?.timeOfArrival ||
          flight?.flightDetails?.[flight?.flightDetails?.length - 1]
            ?.flightInformation?.productDateTime?.timeOfArrival
      ),
    };
  };

  // Helper function to extract flight info from TBO/Kafila responses
  const extractFilteredFlightInfo = (flight) => {
    let flightNumber =
      flight?.Itinerary?.[0].FNo ||
      (flight?.Segments && flight?.Segments[0]?.[0]?.Airline?.FlightNumber);
    let source =
      flight?.Src ||
      (flight?.Segments &&
        flight?.Segments?.[0]?.[0].Origin?.Airport?.AirportCode);
    let destination =
      flight.Des ||
      (flight.Segments &&
        flight.Segments[0][0].Destination?.Airport.AirportCode);
    // let timeOfDeparture = flight.DDate || (flight.Segments && flight.Segments[0][0].Origin.DepTime);
    // let timeOfArrival = flight.ADate || (flight.Segments && flight.Segments[0][0].Destination.ArrTime);
    // Format dates using the new function
    const timeOfDeparture = flight.DDate
      ? convertTBOTime(flight.DDate)
      : flight.Segments
      ? convertTBOTime(flight.Segments[0]?.[0]?.Origin?.DepTime)
      : "";

    const timeOfArrival = flight.ADate
      ? convertTBOTime(flight.ADate)
      : flight.Segments
      ? convertTBOTime(
          flight.Segments[0]?.[flight?.Segments?.[0]?.length - 1].Destination
            .ArrTime
        )
      : "";

    let price = flight.Fare.GrandTotal || flight.Fare.PublishedFare;
    // console.log("tvo Price", price);

    return {
      flightNumber,
      source,
      destination,
      timeOfDeparture,
      timeOfArrival,
      price,
    };
  };

  // Helper function to add or update flight in flightMap
  const addOrUpdateFlight = (flight, source, type) => {
    const {
      flightNumber,
      source: src,
      destination,
      timeOfDeparture,
      timeOfArrival,
      price,
    } = type === "amadeus"
      ? extractAmadeusFlightInfo(flight)
      : extractFilteredFlightInfo(flight);

    const key = `${flightNumber}-${timeOfDeparture}-${timeOfArrival}`;

    if (!flightMap.has(key)) {
      flightMap.set(key, { ...flight, priceSource: source, price });
    } else {
      const existingFlight = flightMap.get(key);
      if (price < existingFlight.price) {
        flightMap.set(key, { ...flight, priceSource: source, price });
      }
    }
  };

  // Add Amadeus flights
  amadeusFlights.forEach((flight) =>
    addOrUpdateFlight(flight, "Amadeus", "amadeus")
  );
  // amadeusFlights.forEach(flight =>
  //   extractAmadeusFlightInfo(flight)
  //   console.log(flight)

  // );

  // Add TBO-Kafila flights
  filteredFlights.forEach((flight) =>
    addOrUpdateFlight(flight, "TBO-Kafila", "filtered")
  );

  // Return the cheapest flights
  return Array.from(flightMap.values());
}
