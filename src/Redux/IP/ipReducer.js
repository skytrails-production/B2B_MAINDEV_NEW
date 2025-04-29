import * as types from "./actionType";

const initState = {
  ipData: {},

  tokenData: {},

  isError: false,

  showSuccessMessage: false,
};

export const ipReducer = (state = initState, action) => {
  const { type, payload } = action;
  // console.log("Payload Reducer", payload);
  switch (type) {
    case types.IP_REQUEST:
      return {
        ...state,
        isError: false,
      };

    case types.IP_SUCCESS:
      return {
        ...state,
        ipData: payload?.data?.ip,
        isError: false,
        showSuccessMessage: true,
      };

    case types.TOKEN_REQUEST:
      return {
        ...state,
        isError: false,
      };

    case types.TOKEN_SUCCESS:
      return {
        ...state,
        tokenData: payload?.data?.data?.TokenId,
        isError: false,
        showSuccessMessage: true,
      };

    default:
      return state;
  }
};
