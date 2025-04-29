import * as types from "./actionType";

export const fetchIp = (data) => {
  return {
    type: types.IP_SUCCESS,
    payload: data,
  };
};

export const ipAction = () => {
  return {
    type: types.IP_REQUEST,
  };
};

export const fetchToken = (data) => {
  return {
    type: types.TOKEN_SUCCESS,
    payload: data,
  };
};

export const tokenAction = (data) => {
  if (data) {
    return {
      type: types.TOKEN_REQUEST,
      payload: data,
    };
  }
};
