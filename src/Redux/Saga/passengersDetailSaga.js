import { takeEvery, takeLatest, call, put } from "redux-saga/effects";
import userApi from "../API/api";
import { fetchPassengersDetails, fetchPassengersDetailsReturns } from "../Passengers/passenger";
import { PASSENGERS_REQUEST, PASSENGERS_REQUEST_RETURN } from "../Passengers/passengerActionType";

function* passengersRequest(action) {
  try {
    const data = yield call(userApi.passengerData, action.payload);
    yield put(fetchPassengersDetails(data));
  } catch (error) {
    console.log(error);
  }
}
function* passengersRequestReturn(action) {
  try {
    const data = yield call(userApi.passengerData, action.payload);
    yield put(fetchPassengersDetailsReturns(data))
  } catch (error) {
    console.log(error);
  }
}
export function* passengersWatcher() {
  yield takeLatest(PASSENGERS_REQUEST, passengersRequest);
  yield takeLatest(PASSENGERS_REQUEST_RETURN, passengersRequestReturn)
}
