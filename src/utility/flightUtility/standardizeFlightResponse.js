import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import {
  formatDateTVO,
  convertDateFormatAMD,
  convertDDateKafila,
} from "./flightTimeConvert";

import duration from "dayjs/plugin/duration"; // For duration calculation
import customParseFormat from "dayjs/plugin/customParseFormat"; // To parse custom time formats

dayjs.extend(duration);
dayjs.extend(customParseFormat);
// Centralized function with error handling

export const standardizeFlightResponse = (response) => {
  //   switch(apiName) {
  //     case 'Amadeus':
  //       return mapAmadeusResponse(response);
  //     case 'TBO':
  //       return mapTBOResponse(response);
  //     case 'Kafila':
  //       return mapKafilaResponse(response);
  //     default:
  //       console.error('Unknown API name:', apiName);
  //       return null;
  //   }

  const mapAmadeusResponse = (flight) => {
    function convertTimeToHoursAndMinutesFlight(time) {
      if (time) {
        const hours = parseInt(time.slice(0, 2));
        const minutes = parseInt(time.slice(2, 4));
        return `${hours}h ${minutes}m`;
      }
    }
    let layover = convertTimeToHoursAndMinutesFlight(
      flight?.propFlightGrDetail?.flightProposal?.[1]?.ref
    );
    let price = Number(
      Number(flight?.monetaryDetail?.[0]?.amount).toFixed(0)
      // -
      // Number(flight?.monetaryDetail?.[1]?.amount)
    ).toFixed(0);
    //     function convertTo24HourFormat(timeStr) {
    function convertTo24HourFormat(timeStr) {
      // Parse the time string as HHmm
      const parsedTime = dayjs(timeStr, "HHmm");

      // Convert to 24-hour format
      return parsedTime.format("HH:mm");
    }
    let departureTime = convertTo24HourFormat(
      flight?.flightDetails?.flightInformation?.productDateTime
        .timeOfDeparture ||
        flight?.flightDetails[0]?.flightInformation?.productDateTime
          .timeOfDeparture
    );
    let arrivalTime = convertTo24HourFormat(
      flight?.flightDetails?.flightInformation?.productDateTime.timeOfArrival ||
        flight?.flightDetails[flight?.flightDetails.length - 1]
          ?.flightInformation?.productDateTime.timeOfArrival
    );
    try {
      return {
        flightName:
          flight?.flightDetails?.flightInformation?.companyId
            ?.marketingCarrier ||
          flight?.flightDetails?.[0]?.flightInformation?.companyId
            ?.marketingCarrier ||
          "N/A",
        flightNumber:
          flight?.flightDetails?.flightInformation?.flightOrtrainNumber ||
          flight?.flightDetails?.[0]?.flightInformation?.flightOrtrainNumber,
        origin:
          flight?.flightDetails?.flightInformation?.location?.[0]?.locationId ||
          flight?.flightDetails?.[0]?.flightInformation?.location?.[0]
            ?.locationId,
        destination: flight?.flightDetails?.flightInformation
          ? flight?.flightDetails?.flightInformation?.location?.[1]?.locationId
          : flight?.flightDetails?.[flight?.flightDetails?.length - 1]
              ?.flightInformation?.location?.[1]?.locationId,

        departureTime: departureTime || "N/A",
        arrivalTime: arrivalTime || "N/A",
        price: price || 0,
        stopes: flight?.flightDetails?.flightInformation
          ? 0
          : flight?.flightDetails?.length - 1,
        terminal1:
          flight?.flightDetails?.[0]?.flightInformation?.location?.[0]
            ?.terminal ||
          flight?.flightDetails?.flightInformation?.location?.[0]?.terminal,
        terminal2:
          flight?.flightDetails?.flightInformation?.location?.[1]?.terminal ||
          flight?.flightDetails?.[flight?.flightDetails?.length - 1]
            ?.flightInformation?.location?.[1]?.terminal,
        layover: layover,
        type: "AMD",
        flight: flight,
        via: !flight?.flightDetails?.flightInformation
          ? flight?.flightDetails?.map((item) => {
              return item?.flightInformation?.location?.[1]?.locationId;
            })
          : [],
        isFreeMeal: false,

        // Add error handling for each field as needed
      };
    } catch (error) {
      console.log("Error mapping Amadeus response:", error);
      return { filght: flight }; // Return null or an error-specific object
    }
  };

  const mapTBOResponse = (flight) => {
    const convertTvoTime = (timestamp) => {
      const time24HourFormat = dayjs(timestamp).format("HH:mm");
      return time24HourFormat;
    };
    let originTime = convertTvoTime(
      flight?.Segments?.[0]?.[0]?.Origin?.DepTime
    );
    let destinationTime = convertTvoTime(
      flight?.Segments?.[0]?.[flight?.Segments?.[0]?.length - 1]?.Destination
        ?.ArrTime
    );
    const nextFlight = flight?.Segments?.[0];
    let layoverHours = 0;
    let layoverMinutes = 0;
    let layoverDuration = 0;
    let price = Number(flight?.Fare?.PublishedFare).toFixed(0) || 0;

    if (nextFlight) {
      const arrivalTime = dayjs(flight?.Segments?.[0]?.[0]?.Origin?.DepTime);
      const departureTime = dayjs(
        flight?.Segments?.[0]?.[flight?.Segments?.[0]?.length - 1]?.Destination
          ?.ArrTime
      );
      layoverDuration = departureTime.diff(arrivalTime, "minutes"); // Calculate difference in minutes
      layoverHours = Math.floor(layoverDuration / 60); // Extract hours
      layoverMinutes = layoverDuration % 60;
    }
    try {
      return {
        flightName: flight?.Segments?.[0]?.[0]?.Airline?.AirlineCode || "N/A",
        flightNumber: flight?.Segments?.[0]?.[0]?.Airline?.FlightNumber,
        origin: flight?.Segments?.[0]?.[0]?.Origin?.Airport?.AirportCode,
        destination:
          flight?.Segments?.[0]?.[flight?.Segments?.[0]?.length - 1]
            ?.Destination?.Airport?.AirportCode,
        departureTime: originTime || "N/A",
        arrivalTime: destinationTime || "N/A",
        price: price || 0,
        stopes: flight?.Segments?.[0]?.length - 1,
        terminal1: flight?.Segments?.[0]?.[0]?.Origin?.Airport?.Terminal,
        terminal2:
          flight?.Segments?.[0]?.[flight?.Segments?.[0]?.length - 1]
            ?.Destination?.Airport?.Terminal,
        layover: `${layoverHours}h ${layoverMinutes}m`,
        type: "TBO",
        flight: flight,
        // via: flight?.Segments?.[0]?.[0]?.Destination?.Airport?.AirportCode,
        via: flight?.Segments?.[0]?.map((item) => {
          return item?.Destination?.Airport?.AirportCode;
        }),
        isFreeMeal: flight?.IsFreeMealAvailable ? true : false,

        // Add error handling for each field as needed
      };
    } catch (error) {
      console.error("Error mapping TBO response:", error);
      return null;
    }
  };

  const mapKafilaResponse = (flight) => {
    // console.log(
    //   flight,
    //   "flight in the map mapKafilaResponse mapKafilaResponse"
    // );
    const FCode = flight?.FCode;
    const flightcode = FCode.split(",")[0];
    const flightnumber = (flight?.FNo).split(",")[0];

    const dateTime = new Date(flight?.DDate);
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");
    const departuretime = `${hours}:${minutes}`;

    const dateTimearrival = new Date(flight?.ADate);
    const hoursarrival = dateTimearrival.getHours().toString().padStart(2, "0");
    const minutesarrival = dateTimearrival
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const departuretimearrival = `${hoursarrival}:${minutesarrival}`;
    // console.log(departuretime);
    const duration = flight?.Dur;
    const parts = duration?.split(":");
    const durationhours = parts?.[1]?.replace("h", "");
    const durationminutes = parts?.[2]?.replace("m", "");
    const totalduration = `${durationhours}h ${durationminutes}m`;
    const price = Number(flight?.Fare?.GrandTotal)?.toFixed(0);
    try {
      if (!duration) {
        return null;
      } else {
        return {
          flightName: flightcode || "N/A",
          flightNumber: flightnumber,
          origin: flight?.Itinerary?.[0]?.Src,
          destination: flight?.Itinerary?.[flight?.Itinerary?.length - 1]?.Des,
          departureTime: departuretime || "N/A",
          arrivalTime: departuretimearrival || "N/A",
          price: price || 0,
          stopes: flight?.Itinerary?.length - 1,
          terminal1: flight?.Itinerary?.[flight?.Itinerary?.length - 1]?.DTrmnl,
          terminal2: flight?.Itinerary?.[flight?.Itinerary?.length - 1]?.ATrmnl,
          layover: totalduration,
          type: "KAFILA",
          flight: flight,
          // via: flight?.Itinerary?.[0]?.Des,
          via: flight?.Itinerary?.map((item) => {
            return item?.Des;
          }),
          isFreeMeal: false,

          // Add error handling for each field as needed
        };
      }
    } catch (error) {
      console.error("Error mapping Kafila response:", error);
      return null;
    }
  };
  if (response.propFlightGrDetail) {
    return mapAmadeusResponse(response);
  } else if (response.ResultIndex) {
    // console.log(response.ResultIndex, "response dot result index");
    return mapTBOResponse(response);
  } else if (response?.FName) {
    // console.log(response?.FName, "respnsie dot fname");
    return mapKafilaResponse(response);
  }
};
function calculateDurationAMD(productDateTime) {
  // Parse the departure date and time separately, then combine into a Day.js object
  // console.log(productDateTime, "departure datexxa,,,,,, ");
  const departureDate = dayjs(productDateTime.dateOfDeparture, "DDMMYY");
  // console.log(departureDate, "departure datea,,,,,, ");
  const departure = departureDate
    .hour(parseInt(productDateTime.timeOfDeparture.slice(0, 2)))
    .minute(parseInt(productDateTime.timeOfDeparture.slice(2)));
  // console.log(departure, "departure departure,,,,,, ");

  // Parse the arrival date and time separately, then combine into a Day.js object
  const arrivalDate = dayjs(productDateTime.dateOfArrival, "DDMMYY");
  const arrival = arrivalDate
    .hour(parseInt(productDateTime.timeOfArrival.slice(0, 2)))
    .minute(parseInt(productDateTime.timeOfArrival.slice(2)));

  // Calculate the difference in milliseconds
  const diff = arrival.diff(departure);

  // Convert the difference into hours and minutes
  const duration = dayjs.duration(diff);
  return `${Math.floor(duration.asHours())}h ${duration.minutes()}m`;
}

function amadiusDuration(item) {
  // Extract hours and minutes from the string
  const hours = parseInt(
    item?.attributeDetails?.attributeDescription.slice(0, 2)
  ); // First two characters
  const minutes = parseInt(
    item?.attributeDetails?.attributeDescription.slice(2)
  ); // Last two characters

  // Return the formatted string
  return `${hours}h ${minutes}m`;
}

const calculateDurationTVO = (arrivalTime, departureTime) => {
  // Parse the timestamps with dayjs
  const arrival = dayjs(arrivalTime);
  const departure = dayjs(departureTime);

  // Calculate the difference in milliseconds
  const diffInMilliseconds = departure.diff(arrival);

  // Convert the difference into a human-readable duration (hours and minutes)
  const durationFormatted = dayjs
    .duration(diffInMilliseconds)
    .format("H[h] m[m]");

  return durationFormatted;
};
export const FlightDetailsAmadeusResponse = (
  flight,
  flightInformation,
  isLayover,
  index
) => {
  // console.log(flight, "flight");

  function convertTimeToHoursAndMinutesFlight(time) {
    //     if (time) {
    //         const hours = parseInt(time.slice(0, 2));
    //         const minutes = parseInt(time.slice(2, 4));
    //         return `${hours}h ${minutes}m`;
    //     }
  }
  // let layover = convertTimeToHoursAndMinutesFlight(
  //     flight?.propFlightGrDetail?.flightProposal?.[1]?.ref
  // );

  function convertTo24HourFormat(timeStr) {
    // Parse the time string as HHmm
    const parsedTime = dayjs(timeStr, "HHmm");
    // console.log(timeStr, parsedTime.format("HH:mm"), "timeStr");

    // Convert to 24-hour format
    return parsedTime.format("HH:mm");
  }
  let departureTime = convertTo24HourFormat(
    flight?.productDateTime.timeOfDeparture ||
      flight?.productDateTime.timeOfDeparture
  );

  let arrivalTime = convertTo24HourFormat(
    flight?.productDateTime.timeOfArrival ||
      flight?.flightDetails[flight?.flightDetails.length - 1]?.flightInformation
        ?.productDateTime.timeOfArrival
  );
  let duration = amadiusDuration(flight);
  let dateOfDeparture = convertDateFormatAMD(
    flight?.productDateTime?.dateOfDeparture
  );
  let dateOfArrival = convertDateFormatAMD(
    flight?.productDateTime?.dateOfArrival
  );
  let layover = false;
  if (isLayover && flightInformation.length > index + 1) {
    let productDateTime = {
      dateOfArrival:
        flightInformation?.[index + 1]?.flightInformation?.productDateTime
          ?.dateOfDeparture,
      dateOfDeparture:
        flightInformation?.[index]?.flightInformation?.productDateTime
          ?.dateOfArrival,

      timeOfArrival:
        flightInformation?.[index + 1]?.flightInformation?.productDateTime
          ?.timeOfDeparture,
      timeOfDeparture:
        flightInformation?.[index]?.flightInformation?.productDateTime
          ?.timeOfArrival,
    };
    // console.log(
    //   productDateTime,
    //   flightInformation,
    //   index,
    //   isLayover,
    //   "productDateTime,flightInformation,index,isLayover"
    // );
    layover = calculateDurationAMD(productDateTime);
    // console.log(
    //   layover,
    //   index,
    //   flightInformation,
    //   isLayover,
    //   "layover,index,flightInformation,isLayover"
    // );
  }

  try {
    return {
      flightName: flight?.companyId?.marketingCarrier || "N/A",
      flightNumber: flight?.flightOrtrainNumber,
      origin: flight?.location?.[0]?.locationId,

      destination: flight?.location?.[1]?.locationId,
      departureTime: departureTime || "N/A",
      arrivalTime: arrivalTime || "N/A",
      duration: duration,
      // duration: ,
      dateOfDeparture: dateOfDeparture,

      dateOfArrival: dateOfArrival,
      // price: price || 0,

      terminal1: flight?.location?.[0]?.terminal,
      terminal2: flight?.location?.[1]?.terminal,

      layover: layover,
      type: "AMD",
      // filght: flight,

      // Add error handling for each field as needed
    };
  } catch (error) {
    console.log("Error mapping Amadeus response:", error);
    return "gfbgf"; // Return null or an error-specific object
  }
};
export const FlightDetailsTBOResponse = (flight, Segments, index) => {
  // console.log(flight);
  const convertTvoTime = (timestamp) => {
    const time24HourFormat = dayjs(timestamp).format("HH:mm");
    return time24HourFormat;
  };
  let originTime = convertTvoTime(flight?.Origin?.DepTime);
  let destinationTime = convertTvoTime(flight?.Destination?.ArrTime);
  // let duration = calculateDurationTVO(originTime, destinationTime)
  // const calculateDurationTVO = (arrivalTime, departureTime) => {
  //     // Parse the timestamps with dayjs
  //     const arrival = dayjs(arrivalTime, "HH:mm");
  //     const departure = dayjs(departureTime, "HH:mm");

  //     // Calculate the difference in milliseconds
  //     let diffInMilliseconds = departure.diff(arrival);

  //     // If the time difference is negative (overnight case), add 24 hours to departure
  //     if (diffInMilliseconds < 0) {
  //         const nextDayDeparture = departure.add(1, "day");
  //         diffInMilliseconds = nextDayDeparture.diff(arrival);
  //     }

  //     // Convert the difference into a duration object
  //     const durationObject = dayjs.duration(diffInMilliseconds);

  //     // Format the duration into hours and minutes
  //     const hours = durationObject.hours();
  //     const minutes = durationObject.minutes();
  //     const durationFormatted = `${hours}h ${minutes}m`;

  //     return durationFormatted;
  // };
  const calculateDurationTVO = (arrivalTime, departureTime) => {
    // Parse the timestamps with dayjs
    const arrival = dayjs(arrivalTime, "HH:mm");
    const departure = dayjs(departureTime, "HH:mm");

    // Calculate the difference in milliseconds
    let diffInMilliseconds = departure.diff(arrival);

    // If the time difference is negative (overnight case), add 24 hours to departure
    if (diffInMilliseconds < 0) {
      const nextDayDeparture = departure.add(1, "day");
      diffInMilliseconds = nextDayDeparture.diff(arrival);
    }

    // Convert the difference into a duration object
    const durationObject = dayjs.duration(diffInMilliseconds);

    // Format the duration into hours and minutes
    const hours = durationObject.hours();
    const minutes = durationObject.minutes();
    const durationFormatted = `${hours}h ${minutes}m`;

    return durationFormatted;
  };
  const calculateDurationTBOISO = (startDate, endDate) => {
    const diffInMs = dayjs(endDate).diff(dayjs(startDate));

    // Convert the difference into a duration
    const diffDuration = dayjs.duration(diffInMs);

    // Format the duration in h:m format
    const formattedDuration = `${Math.floor(
      diffDuration.asHours()
    )}H ${diffDuration.minutes()}M`;

    // console.log(formattedDuration, "tboFlightLayouce"); // Output: "11:25"
    return formattedDuration;
  };
  let duration = calculateDurationTVO(originTime, destinationTime);
  // console.log(originTime, destinationTime, "originTime, destinationTimetbo");
  // console.log(duration, flight?.StopPointArrivalTime, flight?.StopPointDepartureTime, "flight?.StopPointDepartureTime", flight)
  const dateOfDeparture = formatDateTVO(flight?.Origin?.DepTime);
  const dateOfArrival = formatDateTVO(flight?.Destination?.ArrTime);
  let layover = false;
  if (index + 1 < Segments.length) {
    let ArrTime = Segments?.[index + 1]?.Origin?.DepTime;
    let DepTime = Segments?.[index]?.Destination?.ArrTime;
    layover = calculateDurationTBOISO(DepTime, ArrTime);
    // console.log()
    // console.log(
    //   flight,
    //   layover,
    //   Segments,
    //   index,
    //   ArrTime,
    //   "ARR",
    //   DepTime,
    //   "DEP",
    //   "flight in the tbo responseLayoverTBO"
    // );
  }
  try {
    return {
      flightName: flight?.Airline?.AirlineCode || "N/A",
      flightNumber: flight?.Airline?.FlightNumber,
      origin: flight?.Origin?.Airport?.AirportCode,
      destination: flight?.Destination?.Airport?.AirportCode,
      departureTime: originTime || "N/A",
      arrivalTime: destinationTime || "N/A",
      // price: price || 0,
      // stopes: flight?.Segments?.[0]?.length,
      duration: duration,
      // terminal: flight?.Destination?.Airport?.Terminal,
      terminal1: flight?.Origin?.Airport?.Terminal,
      terminal2: flight?.Destination?.Airport?.Terminal,
      dateOfDeparture: dateOfDeparture,

      dateOfArrival: dateOfArrival,

      layover: layover,
      // type: "TBO",
      // filght: flight,
      // Add error handling for each field as needed
    };
  } catch (error) {
    console.error("Error mapping TBO response:", error);
    return null;
  }
};
export const FlightDetailsKafilaResponse = (flight, Itinerary, index) => {
  const FCode = flight?.FCode;
  // const flightcode = FCode.split(",")[0];

  // console.log(flight, "flight in the kafila response");
  const flightnumber = flight?.FNo;

  const dateTime = new Date(flight?.DDate);
  const hours = dateTime.getHours().toString().padStart(2, "0");
  const minutes = dateTime.getMinutes().toString().padStart(2, "0");
  const departuretime = `${hours}:${minutes}`;

  const dateTimearrival = new Date(flight?.ADate);
  const hoursarrival = dateTimearrival.getHours().toString().padStart(2, "0");
  const minutesarrival = dateTimearrival
    .getMinutes()
    .toString()
    .padStart(2, "0");
  const departuretimearrival = `${hoursarrival}:${minutesarrival}`;
  // console.log(departuretime);

  const duration = flight?.Dur;
  const dateOfDeparture = convertDDateKafila(flight?.DDate);
  const dateOfArrival = convertDDateKafila(flight?.ADate);
  // const parts = duration.split(":");
  // const durationhours = parts[1].replace("h", "");
  // const durationminutes = parts[2].replace("m", "");
  // const totalduration = `${durationhours}h ${durationminutes}m`;
  // const price = flight?.Fare?.BasicTotal;
  const findKfilaLayOver = (DDate, ADate) => {
    // console.log(Itinerary, index, "kafilaaaa");
    if (Itinerary.length <= index + 1) {
      return false;
    } else {
      const diffInMs = dayjs(ADate).diff(dayjs(DDate));

      // Convert the difference into a duration
      const diffDuration = dayjs.duration(diffInMs);

      // Format the duration in h:m format
      const formattedDuration = `${Math.floor(
        diffDuration.asHours()
      )}H ${diffDuration.minutes()}M`;
      // console.log(
      //   formattedDuration,
      //   "formattedDurationKafila",
      //   DDate,
      //   ADate,
      //   Itinerary,
      //   Itinerary.length,
      //   index
      // );
      return formattedDuration;
    }
  };
  let layover =
    Itinerary.length == 0
      ? false
      : findKfilaLayOver(
          Itinerary?.[index]?.ADate,
          Itinerary?.[index + 1]?.DDate
        );
  try {
    return {
      flightName: FCode || "N/A",
      flightNumber: flightnumber,
      origin: flight?.Src,
      destination: flight?.Des,
      departureTime: departuretime || "N/A",
      arrivalTime: departuretimearrival || "N/A",
      duration: duration?.slice(3),
      dateOfDeparture: dateOfDeparture,

      dateOfArrival: dateOfArrival,

      //         price: price || 0,
      //         stopes: flight?.Itinerary?.length - 1,
      terminal1: flight?.DTrmnl,
      terminal2: flight?.DTrmnl,

      //         terminal2: flight?.Itinerary?.[flight?.Itinerary?.length - 1]?.ATrmnl,
      layover: layover,
      type: "KAFILA",
      //         filght: flight,

      //         // Add error handling for each field as needed
    };
  } catch (error) {
    console.error("Error mapping Kafila response:", error);
    return null;
  }
};

export const standardizeFlightDetailResponse = (flight) => {
  const type = flight?.type;
  const Flight = flight?.flight;
  // console.log(flight, "stanfflightdetail")
  switch (type) {
    case "AMD":
      const newData = Flight?.flightDetails;

      let isLayover = newData?.flightInformation ? false : true;
      const Data = newData?.flightInformation
        ? [
            FlightDetailsAmadeusResponse(
              newData?.flightInformation,
              isLayover,
              0
            ),
          ]
        : newData?.map((item, index) => {
            const newRes = item?.flightInformation;
            return FlightDetailsAmadeusResponse(
              newRes,
              newData,
              isLayover,
              index
            );
          });
      // console.log(type, Data, "innerfunctiontype")
      return Data;
      break;
    case "TBO":
      const newtbodata = Flight?.Segments[0];
      const TvoData = newtbodata.map((item, index) => {
        return FlightDetailsTBOResponse(item, newtbodata, index);
      });

      return TvoData;
      break;
    case "KAFILA":
      const newKafilaData = Flight?.Itinerary;
      const kafilaData = newKafilaData?.map((item, index) => {
        return FlightDetailsKafilaResponse(item, newKafilaData, index);
      });
      // console.log(type, kafilaData, "innerfunctiontype")
      return kafilaData;
  }
};

const transformFareDataKafila = (Fare, adult, childCount, infantCount) => {
  // Initialize the result object
  const result = {
    Adt: { Basic: 0, Taxes: 0, Total: 0 },
    Chd: { Basic: 0, Taxes: 0, Total: 0 },
    Inf: { Basic: 0, Taxes: 0, Total: 0 },
  };

  // Iterate over each item in the data array
  const addFareDetailsKafila = (type, Fare) => {
    let count = 1;
    if (type == "Adt" && Number(adult) > 0) {
      count = Number(adult);
    } else if (type == "Chd" && Number(childCount) > 0) {
      count = Number(childCount);
    }
    if (type == "Inf" && Number(infantCount) > 0) {
      count = Number(infantCount);
    }

    // console.log(Fare, "fareeeeeeeeeeeeeeeeeeeeeeeKafilaaa");
    if (Fare) {
      result[type].Basic += Fare.Adt.Basic * count || 0;
      result[type].Taxes += Fare.Adt.Taxes * count || 0;
      result[type].Total += Fare.Adt.Total * count || 0;
    }
  };

  // Add values for Adt (Adult)
  if (Fare.Adt) {
    addFareDetailsKafila("Adt", Fare);
  }

  // Add values for Chd (Child)
  if (Fare.Chd) {
    addFareDetailsKafila("Chd", Fare);
  }

  // Add values for Inf (Infant)
  if (Fare.Inf) {
    addFareDetailsKafila("Inf", Fare);
  }

  return result;
};
const transformFareDataTVO = (fare) => {
  // Initialize the result object
  const result = {
    Adt: { Basic: 0, Taxes: 0, Total: 0 },
    Chd: { Basic: 0, Taxes: 0, Total: 0 },
    Inf: { Basic: 0, Taxes: 0, Total: 0 },
  };
  const addFareDetail = (type, Fare) => {
    // console.log(Fare, "fareeeeeeeeeeeeeeeeeeeeeeeTboo");
    if (Fare) {
      result[type].Basic += Fare.BaseFare || 0;
      result[type].Taxes += Fare.Tax || 0;
      result[type].Total += Fare.BaseFare + Fare.Tax || 0;
    }
  };
  const newFare = fare.map((Fare) => {
    // Add values for Adt (Adult)

    if (Fare?.PassengerType == 1) {
      addFareDetail("Adt", Fare);
    }
    // Add values for Chd (Child)

    if (Fare?.PassengerType == 2) {
      addFareDetail("Chd", Fare);
      // result.Chd.Basic += Fare.BaseFare || 0;
      // result.Chd.Taxes += Fare.Tax || 0;
      // result.Chd.Total += Fare.BaseFare + Fare.Tax || 0;
    }
    // Add values for Inf (Infant)
    if (Fare.PassengerType == 3) {
      addFareDetail("Inf", Fare);
    }
  });

  // Iterate over each item in the data array

  return result;
};

const transformFareDataAmadeusNew = (Fare, adult, childCount, infantCount) => {
  const result = {
    Adt: { Basic: 0, Taxes: 0, Total: 0 },
    Chd: { Basic: 0, Taxes: 0, Total: 0 },
    Inf: { Basic: 0, Taxes: 0, Total: 0 },
  };
  // console.log(
  //   Fare,
  //   adult,
  //   childCount,
  //   infantCount,
  //   "fareeeeeeeeeeeeeeeeeeeeeeeAmadeus"
  // );

  const addFareDetails = (paxFareDetail, type) => {
    if (paxFareDetail) {
      let count = 1;
      if (type == "Adt" && Number(adult) > 0) {
        count = Number(adult);
      } else if (type == "Chd" && Number(childCount) > 0) {
        count = Number(childCount);
      }
      if (type == "Inf" && Number(infantCount) > 0) {
        count = Number(infantCount);
      }
      // console.log(type, count, "typeCount");
      result[type].Basic += Number(paxFareDetail.totalFareAmount || 0) * count;
      result[type].Taxes += Number(paxFareDetail.totalTaxAmount || 0) * count;
      result[type].Total += Number(paxFareDetail.totalFareAmount || 0) * count;
      // result[type].Taxes += Number(0);
      // result[type].Total += Number(0);
      // +
      // Number(paxFareDetail.totalTaxAmount || 0);
    }
  };

  // Handle adult fare
  if (Fare?.paxFareDetail) {
    addFareDetails(Fare.paxFareDetail, "Adt");
  } else {
    addFareDetails(Fare[0]?.paxFareDetail, "Adt");

    // Handle child fare if present
    if (Number(childCount) > 0 && Fare[1]?.paxFareDetail) {
      addFareDetails(Fare[1]?.paxFareDetail, "Chd");
    }

    // Handle infant fare if present
    if (Number(infantCount) > 0) {
      const infantIndex = childCount > 0 ? 2 : 1;
      addFareDetails(Fare[infantIndex]?.paxFareDetail, "Inf");
    }
  }
  // console.log(result, "addFareDetailsAMD");

  return result;
};
export const standardizeFlightFareResponse = (flight, adult, child, infant) => {
  const type = flight?.type;
  const Flight = flight?.flight;
  // console.log(flight, type, "stanfflightdetail")
  switch (type) {
    case "AMD":
      const Data = transformFareDataAmadeusNew(Flight, adult, child, infant);

      // console.log(type, Data,
      //     //  Data,
      //     "innerfunctiontype")
      return Data;
      break;
    case "TBO":
      const fare = Flight?.FareBreakdown;
      const FareBreakdown = transformFareDataTVO(fare);

      // const TvoData = newtbodata.map((item) => {
      //     return FlightDetailsTBOResponse(item);
      // });
      // console.log(
      //     type,
      //     FareBreakdown
      //     ,
      //     "innerfunctiontype")
      return FareBreakdown;
      break;
    case "KAFILA":
      const Fare = Flight?.Fare;
      const kafilafare = transformFareDataKafila(Fare, adult, child, infant);
      // const kafilaData = newKafilaData?.map((item) => {
      //     return FlightDetailsKafilaResponse(item);
      // });
      // console.log(
      //     type,
      //     kafilafare,
      //     "innerfunctiontype"
      // )
      return kafilafare;
      break;
  }
};
const transformBaggageDataAMD = (Baggage, Airline) => {
  const baggage =
    Baggage.freeAllowance < 4
      ? `${Baggage?.freeAllowance * 23} KG`
      : `${Baggage?.freeAllowance} KG`;
  return [{ Baggage: baggage, CabinBaggage: "7 KG", Airline: Airline }];
};
const transformBaggageTVO = (Baggage) => {
  const baggage = Baggage[0].map((bag) => {
    return {
      Baggage: bag?.Baggage,
      CabinBaggage: bag?.CabinBaggage,
      Airline: bag?.Airline?.AirlineCode,
    };
  });
  // console.log(baggage
  // )
  return baggage;
};
const transformBaggageKafila = (Baggage, Airline) => {
  const baggage = {
    Baggage: Baggage?.CHKNBG,
    CabinBaggage: Baggage?.CBNBG,
    Airline: Airline,
  };

  // console.log(baggage
  // )
  return baggage;
};
export const standardizeFlightBaggageResponse = (flight) => {
  const type = flight?.type;
  const Flight = flight?.flight;
  const Airline = flight?.flightName;

  // console.log(flight, type, "stanfflightdetail")
  switch (type) {
    case "AMD":
      const baggage = Flight?.baggage?.freeBagAllownceInfo?.baggageDetails;

      const Data = transformBaggageDataAMD(baggage, Airline);

      // console.log(type,
      //     Data,
      //     //  Data,
      //     "innerfunctiontype")
      return Data;
      break;
    case "TBO":
      const baggageTBO = Flight?.Segments;

      const newBaggageTBO = transformBaggageTVO(baggageTBO);

      // console.log(
      //     type,
      //     newBaggageTBO,
      //     // ,
      //     "innerfunctiontype")
      return newBaggageTBO;
      break;
    case "KAFILA":
      const baggageKafila = Flight?.FareRule;
      const newBageKafila = transformBaggageKafila(baggageKafila, Airline);
      // const kafilaData = newKafilaData?.map((item) => {
      //     return FlightDetailsKafilaResponse(item);
      // });
      // console.log(
      //     type,
      //     newBageKafila,
      //     "innerfunctiontype"
      // )
      return [newBageKafila];
      break;
  }
};
