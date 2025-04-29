import { takeLatest,call,put } from "redux-saga/effects";
import userApi from "../API/api"
import {flightHotalSuggestFail,flightHotelSuggest,flightHotelSuggestListReq} from "../FlightHotelSuggest/actionFlightHotelSuggest"
import {FLIGHT_HOTAL_LIST_REQ,FLIGHT_HOTAL_SUCESS,} from "../FlightHotelSuggest/flightHotelSuggestTypes"

function* flightHotalSuggeated(action){
    console.log("hhhhh")
    try {
        const data=yield call(userApi.fetchflightSuggest,action.payload)
    yield put(flightHotelSuggest(data))
    } catch (error) {
        console.log(error)
        yield put(flightHotalSuggestFail())
    }
}

export function* flightHotalSuggeatedWatcher(){
yield takeLatest(FLIGHT_HOTAL_LIST_REQ,flightHotalSuggeated)
}