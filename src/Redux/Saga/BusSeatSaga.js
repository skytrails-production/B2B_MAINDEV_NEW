// import { takeEvery, takeLatest, call, put } from "redux-saga/effects";
// import userApi from "../API/api";
// import { getBusSeat } from "../busSearch/busSearchAction";
// import { BUS_SEAT_LAYOUT_REQUEST } from "../busSearch/actionType";

// function* busSeatSaga(action) {
//   try {
//     const seat = yield call(userApi.getBusSeatLayout, action.payload);
//     yield put(getBusSeat(seat));
//   } catch (error) {
//     console.log(error);
//   }
// }
// export function* busSeatWatcher() {
//   yield takeLatest(BUS_SEAT_LAYOUT_REQUEST, busSeatSaga);
// }
