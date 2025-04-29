import * as types from "./actionType";

export const getPackageBooking = (user) => {
  // console.log("package data",user);
  return {
    type: types.PACKAGE_BOOK_SUCCESS,
    payload: user,
  };
};

export const packageBookingAction = (user) => {
 
  if (user) {
    return {
      type: types.PACKAGE_BOOK_REQUEST,
      payload: user,
    };
  }
};

export const openSuccessModal = () => ({
  type: types.OPEN_SUCCESS_MODAL,
});