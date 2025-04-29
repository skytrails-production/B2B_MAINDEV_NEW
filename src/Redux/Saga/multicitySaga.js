import { takeEvery, takeLatest, call, put } from "redux-saga/effects";

import userApi from "../API/api";
import { fetchMulticity } from "../FlightSearch/Multicity/multicity";
import { MULTICITY_REQUEST } from "../FlightSearch/Multicity/multicityActionType";

function* multicityRequest(action) {
    try {
        const data = yield call(userApi.multicitySearch, action.payload);
        yield put(fetchMulticity(data));
    } catch (error) {
        console.log(error);
    }
}
export function* multicityWatcher() {
    yield takeLatest(MULTICITY_REQUEST, multicityRequest);
}
