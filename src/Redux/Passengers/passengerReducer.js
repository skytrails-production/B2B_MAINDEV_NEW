import * as types from "./passengerActionType";

const initState = {
  passengersData: [],
  passengerDataReturn: [],
  isLoading: false,
  isError: false,
  showSuccessMessage: false,
};

export const passengersReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.PASSENGERS_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case types.PASSENGERS_SUCCESS:
      return {
        ...state,
        passengersData: payload,
        isLoading: false,
        isError: false,
        showSuccessMessage: true,
      };
    case types.PASSENGERS_REQUEST_RETURN:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case types.PASSENGERS_SUCCESS_RETURN:
      return {
        ...state,
        passengerDataReturn: payload,
        isLoading: false,
        isError: false,
        showSuccessMessage: true,
      };
    case types.CLEAR_PASSENGERS_REDUCER:
      return {
        passengersData: [],
        passengerDataReturn: [],

        isLoading: false,

        isError: false,

        showSuccessMessage: false,
      }

    default:
      return state;
  }
};
