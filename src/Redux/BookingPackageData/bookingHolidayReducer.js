// import * as types from "./actionType";

const initState = {
  packageBookID: "",
  isLoading: false,

  isError: false,

  showSuccessMessage: false,
};

export const packageBookingIDReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {

    case "SUBMIT_FORM_DATA":
      return {
        ...state,
        packageBookID: payload,
        isLoading: false,
        isError: false,
        showSuccessMessage: true,
      };

    case "SUBMIT_FORM_DATA_ERROR":
      return {
        ...state,

        isLoading: false,
        isError: true,
        showSuccessMessage: false,
      };


    default:
      return state;
  }
};

