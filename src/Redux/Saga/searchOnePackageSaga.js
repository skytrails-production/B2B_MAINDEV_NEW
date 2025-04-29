import { takeLatest, call, put } from "redux-saga/effects";
import userApi from "../API/api";
import { searchOnePackageData } from "../OnePackageSearchResult/actionOneSearchPackage";
import { GET_ONE_SEARCH_PACKAGE_DATA } from "../OnePackageSearchResult/actionType";

function* searchOneResult(action) { 
  try {
    const data = yield call(userApi.getOnePackage, action.payload);
    yield put(searchOnePackageData(data));
  } catch (error) {
    // console.log(error);
  }
}
export function* searchOneResultWatcher() {
  yield takeLatest(GET_ONE_SEARCH_PACKAGE_DATA, searchOneResult);
}
