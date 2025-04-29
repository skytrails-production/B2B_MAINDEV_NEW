import * as types from "./actionType";

export const packageBooking = (user) => {
  return {
    type: types.PACKAGE_SUCCESS,
    payload: user,
  };
};

export const packageBookingAction = (user) => {
  // console.log("data",user);
  if (user) {
    return {
      type: types.PACKAGE_REQUEST,
      payload: user,
    };
  }
};

