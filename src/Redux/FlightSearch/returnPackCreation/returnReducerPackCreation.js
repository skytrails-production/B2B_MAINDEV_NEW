import * as types from "./returnActionTypePackCreation";

const initState = {
  returnDataPackCretion: [],

  isLoading: false,

  isError: false,

  showSuccessMessage: false,
};

export const returnReducerPackCreation = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.RETURN_REQUEST_PACK_CREATION:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case types.RETURN_SUCCESS_PACK_CREATION:
      return {
        ...state,
        returnData: payload,
        isLoading: false,
        isError: false,
        showSuccessMessage: true,
      };
    case types.CLEAR_RETURN_REDUCER_PACK_CREATION:
      return {
        returnData: [],

        isLoading: false,

        isError: false,

        showSuccessMessage: false,
      };
    default:
      return state;
  }
};
