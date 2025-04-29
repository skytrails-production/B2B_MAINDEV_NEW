import * as types from "./searchFlightType";

const initialState = {
  flightDetails: {},
};

export const searchFlightReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.SEARCH_FLIGHT:
      return {
        flightDetails: payload,
      };
    case types.CLEAR_FLIGHT:
      return {
        flightDetails: {},
      };

    default:
      return state;
  }
};
