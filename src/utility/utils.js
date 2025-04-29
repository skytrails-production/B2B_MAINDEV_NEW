// import { useNavigate } from "react-router-dom";

import { swalModal } from "./swal";
export function formatDate(inputDate) {
  const date = new Date(inputDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// export const checkSearchTime = () => {
//     // const navigate=useNavigate();
//     const lastSearchTime = new Date(sessionStorage.getItem("SessionExpireTime"));
//     if (lastSearchTime) {
//         const currentTime = new Date();
//         const differenceInMinutes = Math.floor(
//             (currentTime.getTime() - lastSearchTime.getTime()) / (1000 * 60)
//         );
//         // const differenceInMinutes = currentTime - lastSearchTime;
//         // console.log(differenceInMinutes, "differenceInMinutes/////////")
//         if (differenceInMinutes < 11) {
//             // console.log('Search time is less than 15 minutes ago.');
//             // setSessionTimeLeft(convertMillisecondsToMinutesAndSeconds(currentTime.getTime() - lastSearchTime.getTime()));

//             // console.log(differenceInMinutes, lastSearchTime, currentTime, SessionTImeLeft, timer_11, "timeleft......");
//             return true;
//         } else if (11 <= differenceInMinutes) {
//             // console.log('Search time is more than 15 minutes ago.');
//             swalModal("flight", "Session is Expired", false);
//             // navigate("/");
//             sessionStorage.removeItem("SessionExpireTime");
//             return false;
//         }
//         // else {

//         // }
//     }
// };
// export function convertMillisecondsToMinutesAndSeconds(milliseconds) {
//   // Convert milliseconds to seconds
//   const totalSeconds = Math.floor(milliseconds / 1000);

//   // Calculate minutes and remaining seconds
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;
//   const timeleft = `${minutes}:${seconds}`;
//   // console.log(timeleft, "time left");
//   return timeleft;
// }

export const formattedPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0, // Removes decimal points
  }).format(price);
};


// export function formatDate(inputDate) {
//   const date = new Date(inputDate);

//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');

//   return `${year}-${month}-${day}`;
// }

export const checkSearchTime = () => {
  // const navigate=useNavigate();
  const lastSearchTime = new Date(sessionStorage.getItem('SessionExpireTime'));
  if (lastSearchTime) {
    const currentTime = new Date();
    const differenceInMinutes = Math.floor((currentTime.getTime() - lastSearchTime.getTime()) / (1000 * 60));
    // const differenceInMinutes = currentTime - lastSearchTime;
    // console.log(differenceInMinutes, "differenceInMinutes/////////")
    if (differenceInMinutes < 11) {
      // console.log('Search time is less than 15 minutes ago.');
      // setSessionTimeLeft(convertMillisecondsToMinutesAndSeconds(currentTime.getTime() - lastSearchTime.getTime()));


      // console.log(differenceInMinutes, lastSearchTime, currentTime, SessionTImeLeft, timer_11, "timeleft......");
      return true


    }
    else if (11 <= differenceInMinutes) {
      // console.log('Search time is more than 15 minutes ago.');
      swalModal("flight", "Session is Expired", false);
      // navigate("/");
      sessionStorage.removeItem("SessionExpireTime");
      return false
    }
    // else {

    // }
  }
};
export function convertMillisecondsToMinutesAndSeconds(milliseconds) {
  // Convert milliseconds to seconds
  const totalSeconds = Math.floor(milliseconds / 1000);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeleft = `${minutes}:${seconds}`
  // console.log(timeleft, "time left");
  return timeleft;
}

