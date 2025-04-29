import * as types from "./multicityActionType";

export const fetchMulticity = (data) => {
  return {
    type: types.MULTICITY_SUCCESS,
    payload: data,
  };
};

export const multicityAction = (data) => {
  if (data) {
    return {
      type: types.MULTICITY_REQUEST,
      payload: data,
    };
  }
};
export const multicityActionClear = () => {
  // if (data) {
  return {
    type: types.CLEAR_MULTICITY_REDUCER,
    // payload: data,
  };
  // }
};
// export const oneWayEMTAction = (data) => {
//   if (data) {
//     return {
//       type: types.ONE_WAY_REQUEST,
//       payload: data,
//     };
//   }
// };

export const clearMulticityReducer = () => {
  return {
    type: types.CLEAR_MULTICITY_REDUCER,
  };
};
