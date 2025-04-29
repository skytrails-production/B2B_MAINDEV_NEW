import * as types from "./oneWayActionType";

export const fetchOneWay = (data) => {
  return {
    type: types.ONE_WAY_SUCCESS,
    payload: data,
  };
};
export const fetchOneWayCombined = (data) => {
  return {
    type: types.ONE_WAY_SUCCESS_COMBINED,
    payload: data,
  };
};
export const fetchOneWayFailed = () => {
  return {
    type: types.ONE_WAY_FAIL,
  };
};
export const fetchOneWayFailedCombined = () => {
  return {
    type: types.ONE_WAY_FAIL_COMBINED,
  };
};

export const oneWayAction = (data) => {
  if (data) {
    return {
      type: types.ONE_WAY_REQUEST,
      payload: data,
    };
  }
};
export const oneWayActionCombined = (data) => {
  if (data) {
    return {
      type: types.ONE_WAY_REQUEST_COMBINED,
      payload: data,
    };
  }
};

export const resetOneWay = () => ({
  type: types.CLEAR_ONEWAY_REDUCER,
});
