import { combineReducers } from "redux";
import { oneWayReducer } from "./FlightSearch/oneWayReducer";
import { searchFlightReducer } from "./SearchFlight/searchFlightReducer";
import { flightListReducer } from "./FlightList/fighListtReducer";
import { faqRatingReducer } from "./Faq&Rating/faqRatingReducer";
import { ipReducer } from "./IP/ipReducer";
import { flightFareReducer } from "./FlightFareQuoteRule/flightFareReducer";
import { flightBookReducer } from "./FlightBook/flightBookReducer";
import { logInReducer } from "./Auth/logIn/logInReducer";
import { clearHotelReducer } from "./Hotel/hotel";
import { hotelReducer } from "./Hotel/hotelReducer";
import { hotelReducerGRN } from "./HotelGRN/hotelReducer";
import { searchPackageReducer } from "./SearchPackage/searchPackageReducer";
import { searchOnePackageReducer } from "./OnePackageSearchResult/searchOnePackageReducer";
import { LOGOUT_REQUEST } from "./Auth/logIn/actionType";
import { packageBookingReducer } from "./HolidayBook/bookingHolidayReducer";
import storage from "redux-persist/lib/storage/session";
import { passengersReducer } from "./Passengers/passengerReducer";
// import {packageBookingReducer} from "./HolidayBook/bookingHolidayReducer"
import { returnReducer } from "./FlightSearch/Return/returnReducer";
import { returnReducerPackCreation } from "./FlightSearch/returnPackCreation/returnReducerPackCreation";
import { multicityReducer } from "./FlightSearch/Multicity/multicityReducer";
import { busSearchReducer } from "./busSearch/busSearchReducer";
// import { packageBookIDReducer } from "./HolidayBookingRequest/bookingHolidayReducer";
import { packageBookingIDReducer } from "./BookingPackageData/bookingHolidayReducer";
import { markUpDataReducer } from "./markup/markupReducer";
import { itenaryReducer } from "./Itenary/itenaryReducer";
import { InventoryReducer } from "./inventoryLogin/InventoryReducer";
import { tnplReducer } from "./TNPL/tnplReducer";
import { airlineSeatMapReducer } from "./AirlineSeatMap/airlineSeatmapReducer";

import { returnSelectedFlightReducer } from "./returnSelectedFlight/returnSelectedFlightReducer";
import { fareQuoteRuleAirselReducer } from "./FareQuoteRuleAirsel/fareQuoteRuleAirselReducer";
import { newFlightBookReducer } from "./newFlightBook/reducerNewFlightBook";

import { flightHotelSuggestReducer } from "./FlightHotelSuggest/flightHotelSuggestReducer";
import { airlineSeatMapReducerNew } from "./AirlineSeatMapNew/airlineSeatmapReducer";

const appReducer = combineReducers({
  logIn: logInReducer,
  oneWay: oneWayReducer,
  return: returnReducer,
  returnPackCreation: returnReducerPackCreation,
  multicity: multicityReducer,
  ip: ipReducer,
  flightFare: flightFareReducer,
  flightBook: flightBookReducer,
  newFlightBook: newFlightBookReducer,
  hotelSearchResult: hotelReducer,
  hotelSearchResultGRN: hotelReducerGRN,
  getBusResult: busSearchReducer,
  searchResult: searchPackageReducer,
  searchOneResult: searchOnePackageReducer,
  packageBook: packageBookingReducer,
  packageBookingID: packageBookingIDReducer,
  markup: markUpDataReducer,
  passengers: passengersReducer,
  TNPL: tnplReducer,
  Itenerary: itenaryReducer,
  searchFlight: searchFlightReducer,
  flightList: flightListReducer,
  faqRating: faqRatingReducer,

  returnSelected: returnSelectedFlightReducer,
  fareQuoteRuleAirselReducer: fareQuoteRuleAirselReducer,
  airlineSeatMap: airlineSeatMapReducer,
  airlineSeatMapNew: airlineSeatMapReducerNew,
  flightSuggested: flightHotelSuggestReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_REQUEST) {
    storage.removeItem("persist:root");
    sessionStorage.clear();
    localStorage.clear();
    return appReducer(undefined, action);
  } else if (action.type === "CLEAR_ONEWAY_REDUCER") {
    return {
      ...state,
      oneWay: oneWayReducer(undefined, action),
    };
  } else if (action.type === "CLEAR_BUS_SEARCH_REDUCER") {
    return {
      ...state,
      getBusResult: busSearchReducer(undefined, action),
    };
  }
  // else if (action.type === "CLEAR_HOTEL_REDUCER") {
  //   return {
  //     ...state,
  //     hotelSearchResult: hotelReducer(undefined, action),
  //   };
  // } else if (action.type === "CLEAR_FARE_DETAILS_REDUCER") {
  //   return {
  //     ...state,
  //     flightFare: flightFareReducer(undefined, action),
  //   };
  // }
  return appReducer(state, action);
};
export default rootReducer;

// import { combineReducers } from "redux";
// import { oneWayReducer } from "./FlightSearch/oneWayReducer";
// import { ipReducer } from "./IP/ipReducer";
// import { flightFareReducer } from "./FlightFareQuoteRule/flightFareReducer";

// const appReducer = combineReducers({
//     oneWay: oneWayReducer,
//     ip: ipReducer,
//     flightFare: flightFareReducer,
// });

// const rootReducer = (state, action) => {
// //   if (action.type === LOGOUT_REQUEST || action.type == ADMIN_SIGN_OUT_REQUEST) {
// //     storage.removeItem("persist:root");
// //     return appReducer(undefined, action);
// //   }
// if (action.type === "CLEAR_ONEWAY_REDUCER") {
//     return {
//       ...state,
//       oneWay: oneWayReducer(undefined, action),
//     };
//   }
//   return appReducer(state, action);
// };
// export default rootReducer;
