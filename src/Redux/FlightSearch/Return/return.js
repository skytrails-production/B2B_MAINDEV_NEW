import * as types from "./returnActionType";

export const fetchReturn = (data) => {
  return {
    type: types.RETURN_SUCCESS,
    payload: data,
  };
};

export const returnAction = (data) => {
  if (data) {
    return {
      type: types.RETURN_REQUEST,
      payload: data,
    };
  }
};
export const returnActionSearchAmd = (data) => {
  if (data) {
    return {
      type: types.RETURN_SEARCH_AMD,
      payload: data,
    };
  }
};
export const returnActionSearchTboKafila = (data) => {
  if (data) {
    return {
      type: types.RETURN_SEARCH_TBO_KAFILA,
      payload: data,
    };
  }
};
export const returnActionClear = () => {
  // if (data) {
  return {
    type: types.CLEAR_RETURN_REDUCER,
    // payload: data,
  };
  // }
};
export const amadeusSearchRequest = (onwardPayload, returnPayload) => ({
  type: types.AMADEUS_SEARCH_RETURN_REQUEST,
  payload: { onwardPayload, returnPayload },
});

export const amadeusSearchSuccess = (data) => ({
  type: types.AMADEUS_SEARCH_RETURN_SUCCESS,
  payload: data,
});

export const amadeusSearchFailure = (error) => ({
  type: types.AMADEUS_SEARCH_RETURN_FAILURE,
  error,
});
export const tbo_kafila_SearchRequest = (onwardPayload, returnPayload) => ({
  type: types.TBO_KAFILA_SEARCH_RETURN_REQUEST,
  payload: { onwardPayload, returnPayload },
});

export const tbo_kafila_SearchSuccess = (data) => ({
  type: types.TBO_KAFILA_SEARCH_RETURN_SUCCESS,
  payload: data,
});

export const tbo_kafila_SearchFailure = (error) => ({
  type: types.TBO_KAFILA_SEARCH_RETURN_FAILURE,
  error,
});
// export const oneWayEMTAction = (data) => {
//   if (data) {
//     return {
//       type: types.ONE_WAY_REQUEST,
//       payload: data,
//     };
//   }
// };

// export const clearReturnReducer = () => {
//   return {
//     type: types.CLEAR_RETURN_REDUCER,
//   };
// };
