import * as types from "./actionType";

export const busSearch = (user) => {
  return {
    type: types.BUS_SEARCH_SUCCESS,
    payload: user,
  };
};

export const busSearchAction = (user) => {
  // console.log("data",user);
  if (user) {
    return {
      type: types.BUS_SEARCH_REQUEST,
      payload: user,
    };
  }
};
export const busSeatBlock = (data) => {
  return {
    type: types.BUS_BLOCK_SUCCESS,
    payload: data
  }
}
export const busSeatBlockAction = (data) => {
  if (data) {
    return {
      type: types.BUS_BLOCK_REQUEST,
      payload: data
    }
  }
}
export const busBook = (data) => {
  return {
    type: types.BUS_BOOK_SUCCESS,
    payload: data
  }
}
export const busBookAction = (data) => {
  if (data) {
    return {
      type: types.BUS_BOOK_REQUEST,
      payload: data
    }
  }
}
export const busBookDetails = (data) => {
  return {
    type: types.BUS_DETAILS_SUCCESS,
    payload: data
  }
}
export const busBookDetailsAction = (data) => {
  if (data) {
    return {
      type: types.BUS_DETAILS_REQUEST,
      payload: data
    }
  }
}

export const clearBusSearchReducer = () => {
  return {
    type: types.CLEAR_BUS_SEARCH_REDUCER,
  };
};
