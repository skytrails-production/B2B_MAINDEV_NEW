import { takeEvery, call, put } from "redux-saga/effects";
import {
  SEAT_SET_AIRLINE_ONWARD,
  SSR_REQUET_ONWARD,
  SSR_REQUEST_RETURN,
} from "../AirlineSeatMapNew/airlineSeatMapType";
import {
  flightSeatFailOnward,
  flightSeatFailReturn,
  flightSeatSuccessOnward,
  flightSeatSuccessReturn,
} from "../AirlineSeatMapNew/actionAirlineSeatMap";
import { flightSeatMap } from "../../utility/flightUtility/BookwarperUtility";

function* flightSeatMapSagaOnward(action) {
  try {
    const data = yield call(flightSeatMap, action.payload);
    yield put(flightSeatSuccessOnward(data));
    // console.log(data, "flightSeatSuccessOnward");
  } catch (error) {
    yield put(flightSeatFailOnward(error.message));
    console.log(error, "flightSeatFailOnward");
  }
}
function* flightSeatMapSagaReturn(action) {
  try {
    // console.log("flightSeatMapSagaReturn", action.payload)
    const data = yield call(flightSeatMap, action.payload);
    // console.log("flightSeatMapSagaReturndata", data)
    yield put(flightSeatSuccessReturn(data));
  } catch (error) {
    yield put(flightSeatFailReturn(error.message));
  }
}

export function* flightSeatMapWatcher() {
  yield takeEvery(SSR_REQUET_ONWARD, flightSeatMapSagaOnward);
  yield takeEvery(SSR_REQUEST_RETURN, flightSeatMapSagaReturn);
}
