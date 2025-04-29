import {  takeLatest, call, put } from "redux-saga/effects";
import userApi from "../API/api";
import { fetchOneWay ,fetchOneWayFailed,fetchOneWayCombined,fetchOneWayFailedCombined} from "../FlightSearch/oneWay";
import { ONE_WAY_REQUEST ,ONE_WAY_REQUEST_COMBINED} from "../FlightSearch/oneWayActionType";

function* oneWayRequest(action) {
  
  try {
    const data = yield call(userApi.oneWaySearch, action.payload);
    yield put(fetchOneWay(data));
  } catch (error) {
    yield put(fetchOneWayFailed())
    console.log(error);

  }
}
function* oneWayRequestCombined(action) {
  try {
    const data = yield call(userApi.oneWaySearchCombined, action.payload);
    yield put(fetchOneWayCombined(data));
  } catch (error) {
    yield put(fetchOneWayFailedCombined())
    console.log(error);

  }
}

export function* oneWayWatcher() {
  yield takeLatest(ONE_WAY_REQUEST, oneWayRequest);
}
export function* oneWayWatcherCombined() {
  yield takeLatest(ONE_WAY_REQUEST_COMBINED, oneWayRequestCombined);
}


// import { takeEvery, takeLatest, call, put } from "redux-saga/effects";
// import userApi from "../API/api";
// import { fetchOneWay, resetOneWay } from "../FlightSearch/oneWay";
// import { CLEAR_ONEWAY_REDUCER, ONE_WAY_REQUEST } from "../FlightSearch/oneWayActionType";

// function* oneWayRequest(action) {
//   try {
//     const data = yield call(userApi.oneWaySearch, action.payload);
//     yield put(fetchOneWay(data));
//   } catch (error) {
//     console.log(error);
//   }
// }
// // 
// function* resetOneWayStateSaga(action) {
//   console.log("resetOneWayStateSaga",action);

//   yield put(resetOneWay());
// }
// export function* oneWayWatcher() {
//   yield(
//     [
//       takeLatest(ONE_WAY_REQUEST, oneWayRequest),
//       takeLatest(CLEAR_ONEWAY_REDUCER, resetOneWayStateSaga),
//     ]
//   )
//   yield 
  
// }

