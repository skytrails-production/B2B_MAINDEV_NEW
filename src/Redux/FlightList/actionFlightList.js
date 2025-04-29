import * as types from "./searchFlightType";
export const searchFlightListReq = (data) => {
  return {
    type: types.SEARCH_FLIGHT_LIST_REQ,
    payload: data,
  };
};
export const searchFlightList = (data) => {
  return {
    type: types.SEARCH_FLIGHT_LIST,
    payload: data,
  };
};
export const clearFlightList = () => {
  return {
    type: types.CLEAR_FLIGHT_LIST,
  };
};
export const searchAirportList = (data) => {
  return {
    type: types.SEARCH_AIRPORT_LIST,
    payload: data,
  };
};
export const searchaAirportListReq = (data) => {
  return {
    type: types.SEARCH_AIRPORT_LIST_REQ,
    payload: data,
  };
};
export const clearAirportList = () => {
  return {
    type: types.CLEAR_AIRPORT_LIST,
  };
};
