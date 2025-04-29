import { takeEvery, call, put, takeLatest } from "redux-saga/effects";
import { NEW_FLIGHT_BOOK_FAIL_ONEWAY, NEW_FLIGHT_BOOK_FAIL_RETURN, NEW_FLIGHT_BOOK_REQUEST_ONEWAY, NEW_FLIGHT_BOOK_REQUEST_RETURN, NEW_FLIGHT_BOOK_SUCESS_ONEWAY, NEW_FLIGHT_BOOK_SUCESS_RETURN } from "../newFlightBook/actionTypes"
import {
    fetchFlightBookFailOneway, fetchFlightBookFailReturn, fetchFlightBookRequestOneway, fetchFlightBookRequestReturn, fetchFlightBookSucessOneway, fetchFlightBookSucessReturn
} from "../newFlightBook/actionNewFlightBook";
import userApi from "../API/api";
import { startBookingProcess } from "../../utility/flightUtility/BookwarperUtility"


function* flightBookRequestOneway(action) {
    console.log("hjjjfgjfdg", action)

    try {
        const data = yield call(startBookingProcess, action?.payload);
        // console.log(data, "dataaaaaaaaaaaaaaaa")

        // yield put(fetchFlightBookSucessOneway(data))
        yield put(fetchFlightBookSucessOneway(data))
    }
    catch (error) {
        yield put(fetchFlightBookFailOneway(error.message))
        console.log(error, "Errorrrrrrrrr")
    }
}
function* flightBookRequestReturn(action) {
    console.log("hjjjfgjfdg", action)
    try {
        const data = yield call(startBookingProcess, action?.payload);
        console.log(data, "dataaaaaaaaaaaaaaaa")
        if (data?.error == true) {
            yield put(fetchFlightBookFailReturn(data))
        }
        else {

            yield put(fetchFlightBookSucessReturn(data))
        }
    }
    catch (error) {
        yield put(fetchFlightBookFailReturn(error.message))
        console.log(error, "Errorrrrrrrrr")
    }
}

export function* flightBookNewWatcher() {
    yield takeEvery(NEW_FLIGHT_BOOK_REQUEST_ONEWAY, flightBookRequestOneway)
    yield takeEvery(NEW_FLIGHT_BOOK_REQUEST_RETURN, flightBookRequestReturn)
}