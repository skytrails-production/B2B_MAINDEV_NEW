import * as types from "./hotelActionType";

const initState = {
  ticketData: [],

  hotelInfo: [],

  hotelRoom: [],

  blockRoom: [],

  bookRoom: [],

  hotelDetails: [],

  isLoading: false,

  isLoadingHotelInfo: false,

  isLoadingHotelRoom: false,

  isLoadingBlockRoom: false,

  isLoadingBookRoom: false,

  isError: false,

  showSuccessMessage: false,
};

export const hotelReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.HOTEL_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case types.HOTEL_SUCCESS:
      return {
        ...state,
        ticketData: payload,
        isLoading: false,
        isError: false,
        showSuccessMessage: true,
      };

    case types.HOTEL_SEARCH_INFO_REQUEST:
      return {
        ...state,
        isLoadingHotelInfo: true,
        isError: false,
      };

    case types.HOTEL_SEARCH_INFO_SUCCESS:
      return {
        ...state,
        hotelInfo: payload?.data?.data,
        isLoadingHotelInfo: false,
        isError: false,
        showSuccessMessage: true,
      };

    case types.HOTEL_ROOM_REQUEST:
      return {
        ...state,
        isLoadingHotelRoom: true,
        isError: false,
      };

    case types.HOTEL_ROOM_SUCCESS:
      return {
        ...state,
        hotelRoom: payload?.data?.data,
        isLoadingHotelRoom: false,
        isError: false,
        showSuccessMessage: true,
      };

    case types.HOTEL_BLOCKROOM_REQUEST:
      return {
        ...state,
        isLoadingBlockRoom: true,
        isError: false,
      };

    case types.HOTEL_BLOCKROOM_SUCCESS:
      return {
        ...state,
        blockRoom: payload?.data?.data,
        isLoadingBlockRoom: false,
        isError: false,
        showSuccessMessage: true,
      };

    case types.HOTEL_B0OKROOM_REQUEST:
      return {
        ...state,
        isLoadingBookRoom: true,
        isError: false,
      };

    case types.HOTEL_B0OKROOM_SUCCESS:
      return {
        ...state,
        bookRoom: payload?.data?.data,
        isLoadingBookRoom: false,
        isError: false,
        showSuccessMessage: true,
      };

    case types.HOTEL_DETAILS_REQUEST:
      return {
        ...state,
        isLoadingBookRoom: false,
        isError: false,
        showSuccessMessage: true,
      };

    case types.HOTEL_DETAILS_SUCCESS:
      return {
        ...state,
        hotelDetails: payload,
        isLoadingBookRoom: false,
        isError: false,
        showSuccessMessage: true,
      };
    case types.CLEAR_HOTEL_BLOCK_ROOM:
      return {
        ...state,
        blockRoom: [],
      };
    case types.CLEAR_HOTEL_ROOM:
      return {
        ...state,
        hotelRoom: [],
        hotelInfo: [],
      };
    case types.CLEAR_HOTEL_REDUCER:
      return {
        ticketData: [],
        hotelInfo: [],
        hotelRoom: [],
        blockRoom: [],
        bookRoom: [],
        hotelDetails: [],
        isLoading: false,
        isLoadingHotelInfo: false,
        isLoadingHotelRoom: false,
        isLoadingBlockRoom: false,
        isLoadingBookRoom: false,
        isError: false,
        showSuccessMessage: false,
      };

    default:
      return state;
  }
};
