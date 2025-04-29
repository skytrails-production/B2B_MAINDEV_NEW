import * as types from "./actionType";

const initState = {
  packageRequestData: [],
  openModal: false,
  isLoading: false,

  isError: false,

  showSuccessMessage: false,
};

export const packageBookingReducer = (state = initState, action) => {
  // console.log("reducer reached")
  const { type, payload } = action;
  switch (type) {
    case types.PACKAGE_BOOK_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case types.PACKAGE_BOOK_SUCCESS:
      return {
        ...state,
        packageRequestData: payload,
        isLoading: false,
        isError: false,
        showSuccessMessage: true,
      };

    case types.OPEN_SUCCESS_MODAL:
      return {
        ...state,
        openModal: true,
        isLoading: true,
        isError: false,
      };



    default:
      return state;
  }
};



