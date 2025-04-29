import * as types from "./hotelActionType";

export const fetchHotel = (data) => {
  return {
    type: types.HOTEL_SUCCESSGRN,
    payload: data,
  };
};

export const hotelActionGRN = (data, page) => {
  if (data) {
    // console.log(data, "dataaaaaaaaaaa", page)
    return {
      type: types.HOTEL_REQUESTGRN,
      payload: { data, page },
    };
  }
};

// fetch few hotel in starting

export const fetchHotelFew = (data) => {
  return {
    type: types.HOTEL_SUCCESSGRNFEW,
    payload: data,
  };
};

export const hotelActionGRNFew = (data, page) => {
  if (data) {
    // console.log(data, "dataaaaaaaaaaa", page)
    return {
      type: types.HOTEL_REQUESTGRNFEW,
      payload: { data, page },
    };
  }
};

// fetch few hotel in starting

export const singleHotelSuccess = (data) => {
  return {
    type: types.HOTEL_SINGLE_SUCCESS,
    payload: data,
  };
};
export const singleHotelGRN = (data) => {
  if (data) {
    return {
      type: types.HOTEL_SINGLE_DETAIL_REQUEST,
      payload: data,
    };
  }
};

export const HotelRoomSelectSuccessGRN = (data) => {
  return {
    type: types.HOTEL_ROOMSELECT_SUCCESS,
    payload: data,
  };
};
export const HotelRoomSelectReqGRN = (data) => {
  if (data) {
    return {
      type: types.HOTEL_ROOMSELECT_REQUEST,
      payload: data,
    };
  }
};

// gallery

export const hotelGallerySuccess = (data) => {
  if (data) {
    return {
      type: types.HOTEL_GALLERY_SUCCESS,
      payload: data,
    };
  }
};

export const hotelGalleryRequest = (data) => {
  return {
    type: types.HOTEL_GALLERY_REQUEST,
    payload: data,
  };
};
// gallery

export const fetchBookRoomHotelGRN = (data) => {
  return {
    type: types.HOTEL_B0OKROOM_SUCCESSGRN,
    payload: data,
  };
};

export const hotelBookRoomActionGRN = (data) => {
  if (data) {
    return {
      type: types.HOTEL_B0OKROOM_REQUESTGRN,
      payload: data,
    };
  }
};

// Hotel booking

export const clearonlyHotelsGRN = () => {
  return {
    type: types.CLEAR_HOTEL_REDUCER_GRN,
  };
};

export const clearHotelReducerGRN = () => {
  return {
    type: types.CLEAR_HOTEL_REDUCER_GRN,
  };
};

export const clearHotelRoomAndGallery = () => {
  return {
    type: types.CLEAR_HOTEL_ROOMGALLERY_GRN,
  };
};
export const clearHotelBlockRoom = () => {
  return {
    type: types.CLEAR_HOTEL_BLOCK_ROOM,
  };
};
export const clearHotelRoomSelect = () => {
  return {
    type: types.CLEAR_HOTEL_ROOM_SELECT,
  };
};
export const clearHotelAll = () => {
  return {
    type: types.CLEAR_HOTEL_ROOM_ALL,
  };
};
