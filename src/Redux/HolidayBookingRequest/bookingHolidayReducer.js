import * as types from "./actionType";

const initState = {
  packageRequestData: [],
  packageBookID: "",
  isLoading: false,

  isError: false,

  showSuccessMessage: false,
};

export const packageBookingReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.PACKAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case types.PACKAGE_SUCCESS:
      return {
        ...state,
        packageRequestData: payload,
        isLoading: false,
        isError: false,
        showSuccessMessage: true,
      };

    default:
      return state;
  }
};
