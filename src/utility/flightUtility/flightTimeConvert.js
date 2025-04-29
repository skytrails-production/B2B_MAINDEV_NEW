import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
// this is used to calculate amades flight dureation
export function calculateDuration(productDateTime) {
  // Parse departure and arrival
  const departure = dayjs(
    `${productDateTime.dateOfDeparture} ${productDateTime.timeOfDeparture}`,
    "YYMMDD HHmm"
  );
  const arrival = dayjs(
    `${productDateTime.dateOfArrival} ${productDateTime.timeOfArrival}`,
    "YYMMDD HHmm"
  );

  // Calculate the difference in milliseconds
  const diff = arrival.diff(departure);

  // Format the duration
  const duration = dayjs.duration(diff);
  return `${Math.floor(duration.asHours())}h ${duration.minutes()}m`; // Total hours including days
}
// Output: "2h 45m"

export const calculateDurationTVO = (arrivalTime, departureTime) => {
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
// Example Usage
const StopPointArrivalTime = "0001-01-01T00:00:00";
const StopPointDepartureTime = "0001-01-01T02:45:00";

// const duration = calculateDuration(StopPointArrivalTime, StopPointDepartureTime);
// console.log(duration); // Output: "2h 45m"
// "22, Jan, 2025"
// this function is used to convert "220125" to "22, Jan, 2025"
export const convertDateFormatAMD = (dateStr) => {
  // Parse the string in DDMMYY format
  const parsedDate = dayjs(dateStr, "DDMMYY");
  // Format it as required
  return parsedDate.format("DD, MMM, YYYY");
};

// Example usage
// const dateOfDeparture = "220125";
// const formattedDate = convertDateFormat(dateOfDeparture);

// console.log(formattedDate); // Output: "22, Jan, 2025"
// this function is used to convert "2025-01-22T08:30:00" to "22, Jan, 2025"
export const formatDateTVO = (dateStr) => {
  // Parse the date and format it
  return dayjs(dateStr).format("DD, MMM, YYYY");
};

// // Example usage
// const dateStr = "2025-01-22T08:30:00";
// const formattedDate = formatDate(dateStr);

// console.log(formattedDate); // Output: "22, Jan, 2025"

export const convertDDateKafila = (dateStr) => {
  // Parse the ISO date string and format it
  return dayjs(dateStr).format("DD, MMM, YYYY");
};

// Example usage
// const DDate = "2025-01-22T08:30:00";
// const formattedDate = convertDDate(DDate);

// console.log(formattedDate); // Output: "22, Jan, 2025"
