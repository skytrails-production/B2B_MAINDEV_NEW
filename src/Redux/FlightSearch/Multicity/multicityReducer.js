import * as types from "./multicityActionType";

const initState = {
  multicityData: [],
  isLoading: false,
  isError: false,
  showSuccessMessage: false,
};

export const multicityReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.MULTICITY_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case types.MULTICITY_SUCCESS:
      return {
        ...state,
        multicityData: payload,
        isLoading: false,
        isError: false,
        showSuccessMessage: true,
      };
    case types.CLEAR_MULTICITY_REDUCER:
      return {
        multicityData: [],
        isLoading: false,
        isError: false,
        showSuccessMessage: false,
      };
    default:
      return state;
  }
};
