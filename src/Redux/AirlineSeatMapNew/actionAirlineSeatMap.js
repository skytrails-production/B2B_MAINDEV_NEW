import * as types from "./airlineSeatMapType";
export const flightSeatRequestOnward = (data) => {
  return {
    type: types.SSR_REQUET_ONWARD,
    payload: data,
  };
};
export const flightSeatRequestReturn = (data) => {
  return {
    type: types.SSR_REQUEST_RETURN,
    payload: data,
  };
};
export const flightSeatSuccessOnward = (data) => {
  return {
    type: types.SSR_SUCCESS_ONWARD,
    payload: data,
  };
};
export const flightSeatFailOnward = (data) => {
  return {
    type: types.SSR_FAIL_ONWARD,
    payload: data,
  };
};
export const flightSeatFailReturn = (data) => {
  return {
    type: types.SSR_FAIL_RETURN,
    payload: data,
  };
};
export const flightSeatSuccessReturn = (data) => {
  return {
    type: types.SSR_SUCCESS_RETURN,
    payload: data,
  };
};
export const number_of_seat_map_onward = (data) => {
  return {
    type: types.NUMBER_OF_AIRLINE_ONWARD,
    payload: data,
  };
};
export const number_of_seat_map_return = (data) => {
  return {
    type: types.NUMBER_OF_AIRLINE_ONWARD,
    payload: data,
  };
};
export const setAirlineSeat_onward = (data) => {
  return {
    type: types.SEAT_SET_AIRLINE_ONWARD,
    payload: data,
  };
};
export const setAirlineSeat_retrun = (data) => {
  return {
    type: types.SEAT_SET_AIRLINE_RETURN,
    payload: data,
  };
};
export const setSeatMidAmountOnward = (data) => {
  return {
    type: types.SEAT_SET_MID_AMOUNT_ONWARD,
    payload: data,
  };
};
export const setSeatMidAmountReturn = (data) => {
  return {
    type: types.SEAT_SET_MID_AMOUNT_RETURN,
    payload: data,
  };
};
export const setSeatAmountTvoOnward = (data) => {
  return {
    type: types.SEAT_SET_AMOUNT_TVO_ONWARD,
    payload: data,
  };
};
export const setSeatAmountTvoRetrun = (data) => {
  return {
    type: types.SEAT_SET_AMOUNT_TVO_RETURN,
    payload: data,
  };
};
export const setDefaultSeatOccupationOnward = (data) => {
  return {
    type: types.DEFAULT_SEAT_OCCUPATION_ONWARD,
    payload: data,
  };
};
export const setDefaultSeatOccupationReturn = (data) => {
  return {
    type: types.DEFAULT_SEAT_OCCUPATION_RETURN,
    payload: data,
  };
};
export const setAirlineAmountOnward = (data) => {
  return {
    type: types.AMOUNT_SET_AIRLINE_ONWARD,
    payload: data,
  };
};
export const setAirlineAmountReturn = (data) => {
  return {
    type: types.AMOUNT_SET_AIRLINE_RETURN,
    payload: data,
  };
};
export const clearAirlineSeatOnward = () => {
  return {
    type: types.CLEAR_SEAT_AIRRLINE_ONWARD,
  };
};
export const clearAirlineSeatReturn = () => {
  return {
    type: types.CLEAR_SEAT_AIRRLINE_RETURN,
  };
};
export const setAirlineMeal_onward = (data) => {
  return {
    type: types.MEAL_SET_AIRLINE_ONWARD,
    payload: data,
  };
};
export const setAirlineMeal_retrun = (data) => {
  return {
    type: types.MEAL_SET_AIRLINE_RETURN,
    payload: data,
  };
};
export const setAirlineBaggage_onward = (data) => {
  return {
    type: types.BAGGAGE_SET_AIRLINE_ONWARD,
    payload: data,
  };
};
export const setAirlineBaggage_retrun = (data) => {
  return {
    type: types.BAGGAGE_SET_AIRLINE_RETURN,
    payload: data,
  };
};

export const clear_all_airlineNew = () => {
  return {
    type: types.CLEAR_ALL_AIRRLINE_ONWARD,
  };
};
