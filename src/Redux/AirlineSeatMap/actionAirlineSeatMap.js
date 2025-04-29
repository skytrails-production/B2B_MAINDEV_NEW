import * as types from "./airlineSeatMapType";
export const number_of_seat_map = (data) => {
  return {
    type: types.NUMBER_OF_AIRLINE,
    payload: data,
  };
};
export const setAirlineSeat = (data) => {
  return {
    type: types.SEAT_SET_AIRLINE,
    payload: data,
  };
};
export const setSeatMidAmount = (data) => {
  return {
    type: types.SEAT_SET_MID_AMOUNT,
    payload: data,
  };
};
export const setSeatAmountTvo = (data) => {
  return {
    type: types.SEAT_SET_AMOUNT_TVO,
    payload: data,
  };
};
export const setDefaultSeatOccupation = (data) => {
  return {
    type: types.DEFAULT_SEAT_OCCUPATION,
    payload: data,
  };
};
export const setAirlineAmount = (data) => {
  return {
    type: types.AMOUNT_SET_AIRLINE,
    payload: data,
  };
};
export const clearAirlineSeat = () => {
  return {
    type: types.CLEAR_SEAT_AIRRLINE,
  };
};
export const clear_all_airline = () => {
  return {
    type: types.CLEAR_ALL_AIRRLINE,

  };
};
