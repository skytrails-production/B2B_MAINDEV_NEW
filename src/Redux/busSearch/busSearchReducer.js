import * as types from "./actionType";

const initState = {
  busResult: [],
  busBlock: [],
  busBook: [],
  busDetails: [],
  isLoading: false,
  isError: false,
  isLoadingBlockBus: false,
  isLoadingDetails: false,
  isLoadingBook: false,
  showSuccessMessage: false,
};

export const busSearchReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.BUS_SEARCH_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case types.BUS_SEARCH_SUCCESS:
      return {
        ...state,
        busResult: payload,
        isLoading: false,
        isError: false,
        showSuccessMessage: true,
      };
    case types.BUS_BLOCK_REQUEST:
      return {
        ...state,
        isLoadingBlockBus: true,
        isError: false,
      };
    case types.BUS_BLOCK_SUCCESS:
      return {
        ...state,
        busBlock: payload,
        isLoadingBlockBus: false,
        isError: false,
        showSuccessMessage: true,
      };
    case types.BUS_BOOK_REQUEST:
      return {
        ...state,
        isLoadingBook: true,
        isError: false
      }
    case types.BUS_BOOK_SUCCESS:
      return {
        ...state,
        busBook: payload,
        isLoadingBook: false,
        isError: false,
        showSuccessMessage: true
      }
    case types.BUS_DETAILS_SUCCESS:
      return {
        ...state,
        busDetails: payload,
        isError: false,
        isLoadingDetails: false,
        showSuccessMessage: true
      }
    case types.BUS_DETAILS_REQUEST:
      return {
        ...state,
        isLoadingDetails: true,
        isError: false
      }
    case types.CLEAR_BUS_SEARCH_REDUCER:
      return {
        busResult: [],
        busBlock: [],
        busBook: [],
        busDetails: [],
        isLoading: false,
        isError: false,
        isLoadingBlockBus: false,
        isLoadingDetails: false,
        isLoadingBook: false,
        showSuccessMessage: false,
      }

    default:
      return state;
  }
};
