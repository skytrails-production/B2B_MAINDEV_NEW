import { takeEvery, call, put, takeLatest } from "redux-saga/effects";
import { FARE_QUOTE_RULE_AIRSEL_FAIL_ONEWAY, FARE_QUOTE_RULE_AIRSEL_FAIL_RETURN, FARE_QUOTE_RULE_AIRSEL_REQUEST_ONEWAY, FARE_QUOTE_RULE_AIRSEL_REQUEST_RETURN, FARE_QUOTE_RULE_AIRSEL_SUCESS_ONEWAY, FARE_QUOTE_RULE_AIRSEL_SUCESS_RETURN } from "../FareQuoteRuleAirsel/actionType"
import {
    fetchFlightQuotesAireselFailOneway,
    fetchFlightQuotesAireselFailReturn, fetchFlightQuotesAireselRequestOneway, fetchFlightQuotesAireselRequestReturn, fetchFlightQuotesAireselSucessOneway, fetchFlightQuotesAireselSucessReturn
} from "../FareQuoteRuleAirsel/actionFlightQuoteRuleAirsel";
import userApi from "../API/api";
import { fareQuateRuleAirsel } from "../../utility/flightUtility/BookwarperUtility"

function* fareQuoteRuleAirselRequest(action) {
    // console.log("hjjjfgjfdg", action)
    try {
        const data = yield call(fareQuateRuleAirsel, action?.payload);
        // console.log(data, "dataaaaaaaaaaaaaaaa")

        yield put(fetchFlightQuotesAireselSucessOneway(data))
    }
    catch (error) {
        yield put(fetchFlightQuotesAireselFailOneway(error.message))
        console.log(error, "Errorrrrrrrrr")
    }
}
function* fareQuoteRuleAirselRequestReturn(action) {
    // console.log("hjjjfgjfdg", action)
    try {
        const data = yield call(fareQuateRuleAirsel, action?.payload);
        // console.log(data, "dataaaaaaaaaaaaaaaa")
        if (data?.error == true) {
            yield put(fetchFlightQuotesAireselFailReturn(data))
        }
        else {

            yield put(fetchFlightQuotesAireselSucessReturn(data))
        }
    }
    catch (error) {
        yield put(fetchFlightQuotesAireselFailReturn(error.message))
        console.log(error, "Errorrrrrrrrr")
    }
}

export function* fareQuotesRuleAirselWatcher() {
    yield takeEvery(FARE_QUOTE_RULE_AIRSEL_REQUEST_ONEWAY, fareQuoteRuleAirselRequest)
    yield takeEvery(FARE_QUOTE_RULE_AIRSEL_REQUEST_RETURN, fareQuoteRuleAirselRequestReturn)
}