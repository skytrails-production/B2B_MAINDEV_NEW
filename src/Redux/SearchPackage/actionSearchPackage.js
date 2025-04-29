import * as types from "./actionType";

export const searchPackageData = (data) => {
  return {
    type: types.SET_SEARCH_PACKAGE_DATA,
    payload: data,
  };
};

export const searchPackageAction = (data) => {
  return {
    type: types.GET_SEARCH_PACKAGE_DATA,
    payload: data,
  };
};

export const searchPackageDataCategory = (data) => {
  return {
    type: types.SET_SEARCH_PACKAGE_DATA_CATEGORY,
    payload: data,
  };
};

export const searchPackageActionCategory = (data) => {
  return {
    type: types.GET_SEARCH_PACKAGE_DATA_CATEGORY,
    payload: data,
  };
};

export const searchPackageDataTopCountries = (data) => {
  return {
    type: types.SET_SEARCH_PACKAGE_DATA_COUNTRY,
    payload: data,
  };
};

export const searchPackageActionTopCountries = (data) => {
  return {
    type: types.GET_SEARCH_PACKAGE_DATA_COUNTRY,
    payload: data,
  };
};

export const searchPackageBudget = (data) => {
  return {
    type: types.SET_SEARCH_PACKAGE_DATA_BUDGET,
    payload: data,
  };
};

export const searchPackageActionBudget = (data) => {
  return {
    type: types.GET_SEARCH_PACKAGE_DATA_BUDGET,
    payload: data,
  };
};

export const searchAllPackage = (data) => {
  return {
    type: types.SET_ALL_PACKAGE_DATA,
    payload: data,
  };
};

export const searchAllPackageAction = (data) => {
  return {
    type: types.GET_ALL_PACKAGE_DATA,
    payload: data,
  };
};

export const searchThemePackage = (data) => {
  return {
    type: types.SET_THEME_PACKAGE_DATA,
    payload: data,
  };
};

export const searchThemePackageAction = (data) => {
  return {
    type: types.GET_THEME_PACKAGE_DATA,
    payload: data,
  };
};

export const clearPackageData = () => {
  return {
    type: types.CLEAR_PACKAGE_DATA,
    payload: [],
  };
};
