import * as types from "./actionType";

export const searchOnePackageData = (data) => {
  return {
    type: types.SET_ONE_SEARCH_PACKAGE_DATA,
    payload: data,
  };
};

export const searchOnePackageAction = (data) => {
  //  console.log("searchOnePackageAction",data);
  return {
    type: types.GET_ONE_SEARCH_PACKAGE_DATA,
    payload: data,
  };

};

export const clearHolidayReducer = () => {
  return {
    type: types.CLEAR_HOLIDAY_REDUCER,
  };
};