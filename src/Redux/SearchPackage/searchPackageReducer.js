import * as types from "./actionType";

const initialState = {
  packageSearchResult: [],
  isLogin: false,
  isLoading: false,
  isError: false,
};

export const searchPackageReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.GET_SEARCH_PACKAGE_DATA:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };

    case types.SET_SEARCH_PACKAGE_DATA:
      return {
        ...state,
        packageSearchResult: payload,
        isLoading: true,
        isError: false,
      };
    case types.GET_SEARCH_PACKAGE_DATA_CATEGORY:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };

    case types.SET_SEARCH_PACKAGE_DATA_CATEGORY:
      return {
        ...state,
        packageSearchResult: payload,
        isLoading: true,
        isError: false,
      };

    case types.GET_SEARCH_PACKAGE_DATA_COUNTRY:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };

    case types.SET_SEARCH_PACKAGE_DATA_COUNTRY:
      return {
        ...state,
        packageSearchResult: payload,
        isLoading: true,
        isError: false,
      };

    case types.GET_SEARCH_PACKAGE_DATA_BUDGET:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };

    case types.SET_SEARCH_PACKAGE_DATA_BUDGET:
      return {
        ...state,
        packageSearchResult: payload,
        isLoading: true,
        isError: false,
      };
    case types.GET_ALL_PACKAGE_DATA:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };

    case types.SET_ALL_PACKAGE_DATA:
      return {
        ...state,
        packageSearchResult: payload,
        isLoading: true,
        isError: false,
      };
    case types.GET_THEME_PACKAGE_DATA:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };

    case types.SET_THEME_PACKAGE_DATA:
      return {
        ...state,
        packageSearchResult: payload,
        isLoading: true,
        isError: false,
      };
    case types.CLEAR_PACKAGE_DATA:
      return {
        packageSearchResult: [],
        isLogin: false,
        isLoading: false,
        isError: false,
      };

    default:
      return state;
  }
};
