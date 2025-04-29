
import * as types from "./actionType";

const initialState = {
  OneSearchPackageResult: [],
  isLogin: false,
  isLoading: false,
  isError: false,
};

export const searchOnePackageReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.GET_ONE_SEARCH_PACKAGE_DATA:
      return {
        ...state,

        isLoading: false,
        isError: false,
      };

    case types.SET_ONE_SEARCH_PACKAGE_DATA:
      return {
        ...state,
        OneSearchPackageResult: payload,
        isLoading: true,
        isError: false,
      };
    case types.CLEAR_HOLIDAY_REDUCER:
      return {
        OneSearchPackageResult: [],
        isLogin: false,
        isLoading: false,
        isError: false,
      };


    default:
      return state;
  }
};
