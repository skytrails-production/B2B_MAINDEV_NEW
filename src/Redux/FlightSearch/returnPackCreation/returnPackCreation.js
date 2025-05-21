import * as types from "./returnActionTypePackCreation";

export const fetchReturnPackCreation = (data) => {
  return {
    type: types.RETURN_SUCCESS_PACK_CREATION,
    payload: data,
  };
};

export const returnActionPackCreation = (data) => {
  if (data) {
    return {
      type: types.RETURN_REQUEST_PACK_CREATION,
      payload: data,
    };
  }
};
export const returnActionClearPackCreation = () => {
  // if (data) {
  return {
    type: types.CLEAR_RETURN_REDUCER_PACK_CREATION,
    // payload: data,
  };
  // }
};

export const clearReturnReducer = () => {
  return {
    type: types.CLEAR_RETURN_REDUCER_PACK_CREATION,
  };
};
