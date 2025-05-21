import { takeEvery, takeLatest, call, put } from "redux-saga/effects";

import userApi from "../API/api";
import { fetchReturnPackCreation } from "../FlightSearch/returnPackCreation/returnPackCreation";
import { RETURN_REQUEST_PACK_CREATION } from "../FlightSearch/returnPackCreation/returnActionTypePackCreation";
// import { fetchReturn } from "../FlightSearch/Return/return";
// import { RETURN_REQUEST } from "../FlightSearch/Return/returnActionType";

function* returnRequest(action) {
  try {
    const data = yield call(userApi.returnSearch, action.payload);
    yield put(fetchReturnPackCreation(data));
  } catch (error) {
    console.log(error);
  }
}
export function* returnWatcherPackCreation() {
  yield takeLatest(RETURN_REQUEST_PACK_CREATION, returnRequest);
}
