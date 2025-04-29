import * as types from "./searchFlightType";

const initialState = {
  flightDetails: {},
  aireportList: {}

};

export const flightListReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.SEARCH_FLIGHT_LIST:
      return {
        ...state,
        flightDetails: payload,
      };
    case types.SEARCH_FLIGHT_LIST_REQ:
      return {
        ...state,

      };
    case types.CLEAR_FLIGHT_LIST:
      return {
        ...state,
        flightDetails: {},
      };
    case types.SEARCH_AIRPORT_LIST_REQ:
      return {
        ...state,

      };
    case types.SEARCH_AIRPORT_LIST:
      return {
        ...state,
        aireportList: payload,
      };
    case types.CLEAR_AIRPORT_LIST:
      return {
        ...state,
        aireportList: {},
      };

    default:
      return state;
  }
};
