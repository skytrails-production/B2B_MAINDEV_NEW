import * as types from "./hotelActionType";

export const fetchHotel = (data) => {
  return {
    type: types.HOTEL_SUCCESS,
    payload: data,
  };
};

export const hotelAction = (data) => {
  if (data) {
    return {
      type: types.HOTEL_REQUEST,
      payload: data,
    };
  }
};

export const fetchSearchInfoHotel = (data) => {
  return {
    type: types.HOTEL_SEARCH_INFO_SUCCESS,
    payload: data,
  };
};

export const hotelSearchInfoAction = (data) => {
  if (data) {
    return {
      type: types.HOTEL_SEARCH_INFO_REQUEST,
      payload: data,
    };
  }
};

export const fetchRoomHotel = (data) => {
  return {
    type: types.HOTEL_ROOM_SUCCESS,
    payload: data,
  };
};

export const hotelRoomAction = (data) => {
  if (data) {
    return {
      type: types.HOTEL_ROOM_REQUEST,
      payload: data,
    };
  }
};

export const fetchBlockRoomHotel = (data) => {
  return {
    type: types.HOTEL_BLOCKROOM_SUCCESS,
    payload: data,
  };
};

export const hotelBlockRoomAction = (data) => {
  if (data) {
    return {
      type: types.HOTEL_BLOCKROOM_REQUEST,
      payload: data,
    };
  }
};

export const fetchBookRoomHotel = (data) => {
  return {
    type: types.HOTEL_B0OKROOM_SUCCESS,
    payload: data,
  };
};

export const hotelBookRoomAction = (data) => {
  if (data) {
    return {
      type: types.HOTEL_B0OKROOM_REQUEST,
      payload: data,
    };
  }
};

// Hotel booking Details
export const HotelDetails = (data) => {
  // console.log("data", data);
  return {
    type: types.HOTEL_DETAILS_SUCCESS,
    payload: data,
  };
};

export const HotelDetailsAction = (data) => {
  if (data) {
    return {
      type: types.HOTEL_DETAILS_REQUEST,
      payload: data,
    };
  }
};

export const clearHotelReducer = () => {
  return {
    type: types.CLEAR_HOTEL_REDUCER,
  };
};
export const clearHotelBlockRoom = () => {
  return {
    type: types.CLEAR_HOTEL_BLOCK_ROOM,
  };
};

export const clearHotelRoom = () => {
  return {
    type: types.CLEAR_HOTEL_ROOM,
  };
};
