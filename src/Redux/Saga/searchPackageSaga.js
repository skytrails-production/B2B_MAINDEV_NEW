import { takeLatest, call, put } from "redux-saga/effects";
import userApi from "../API/api";

import {
  GET_ALL_PACKAGE_DATA,
  GET_SEARCH_PACKAGE_DATA,
  GET_SEARCH_PACKAGE_DATA_BUDGET,
  GET_SEARCH_PACKAGE_DATA_CATEGORY,
  GET_SEARCH_PACKAGE_DATA_COUNTRY,
  GET_THEME_PACKAGE_DATA,
} from "../SearchPackage/actionType";
import {
  searchAllPackage,
  searchPackageBudget,
  searchPackageData,
  searchPackageDataCategory,
  searchPackageDataTopCountries,
  searchThemePackage,
} from "../SearchPackage/actionSearchPackage";

function* searchResult(action) {
  try {
    const data = yield call(userApi.searchPackage, action.payload);
    yield put(searchPackageData(data));
  } catch (error) {
    // console.log(error);
  }
}
function* searchResultCategory(action) {
  try {
    const data = yield call(userApi.searchPackageCategory, action.payload);
    yield put(searchPackageDataCategory(data));
  } catch (error) {
    // console.log(error);
  }
}
function* searchResultTopCountries(action) {
  try {
    const data = yield call(userApi.searchPackageCountry, action.payload);
    yield put(searchPackageDataTopCountries(data));
  } catch (error) {
    // console.log(error);
  }
}
function* searchResultBudget(action) {
  try {
    const data = yield call(userApi.searchPackageBudget, action.payload);
    yield put(searchPackageBudget(data));
  } catch (error) {
    // console.log(error);
  }
}
function* getALLResult(action) {
  try {
    const data = yield call(userApi.getAllPackages, action.payload);
    yield put(searchAllPackage(data));
  } catch (error) {
    // console.log(error);
  }
}
function* getThemeResult(action) {
  try {
    const data = yield call(userApi.getThemePackages, action.payload);
    yield put(searchThemePackage(data));
  } catch (error) {
    // console.log(error);
  }
}
export function* searchResultWatcher() {
  yield takeLatest(GET_SEARCH_PACKAGE_DATA, searchResult);
  yield takeLatest(GET_SEARCH_PACKAGE_DATA_CATEGORY, searchResultCategory);
  yield takeLatest(GET_SEARCH_PACKAGE_DATA_COUNTRY, searchResultTopCountries);
  yield takeLatest(GET_SEARCH_PACKAGE_DATA_BUDGET, searchResultBudget);
  yield takeLatest(GET_ALL_PACKAGE_DATA, getALLResult);
  yield takeLatest(GET_THEME_PACKAGE_DATA, getThemeResult);
}
