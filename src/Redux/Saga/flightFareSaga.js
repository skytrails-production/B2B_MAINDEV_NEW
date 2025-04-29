// import { call, put, takeLatest } from "redux-saga/effects";
// import userApi from "../API/api";
// import { QUOTE_REQUEST, RULE_REQUEST } from "../FlightFareQuoteRule/actionType";
// import {
//   fetchQuote,
//   fetchRule,
// } from "../FlightFareQuoteRule/actionFlightQuote";

// function* ruleRequest(action) {
//   try {
//     // console.log("Inside Rule Saga");
//     const user = yield call(userApi.flightRuleSearch, action.payload);
//     yield put(fetchRule(user));
//   } catch (error) {
//     yield put(fetchRule({}));
//   }
// }

// function* quoteRequest(action) {
//   try {
//     const user = yield call(userApi.flightQuoteSearch, action.payload);
//     yield put(fetchQuote(user));
//   } catch (error) {
//     yield put(fetchQuote({}));
//   }
// }

// export function* flightFareWatcher() {
//   yield takeLatest(RULE_REQUEST, ruleRequest);
//   yield takeLatest(QUOTE_REQUEST, quoteRequest);
// }


import { takeEvery, call, put, takeLatest } from "redux-saga/effects";
import userApi from "../API/api";
import { } from "../Auth/logIn/actionLogin";
import {
  QUOTE_REQUEST,
  RULE_REQUEST,
  QUOTE_REQUEST_RETURN,
  RULE_REQUEST_RETURN,
} from "../FlightFareQuoteRule/actionType";
import {
  fetchQuote,
  fetchRule,
  fetchQuoteReturn,
  fetchRuleReturn,
} from "../FlightFareQuoteRule/actionFlightQuote";

function* ruleRequest(action) {
  try {
    console.log("Inside Rule Saga");
    const user = yield call(userApi.flightRuleSearch, action.payload);
    yield put(fetchRule(user));
  } catch (error) {
    yield put(fetchRule({}));
  }
}

function* quoteRequest(action) {
  try {
    const user = yield call(userApi.flightQuoteSearch, action.payload);
    yield put(fetchQuote(user));
  } catch (error) {
    yield put(fetchQuote({}));
  }
}

function* quoteRequestReturn(action) {
  try {
    const user = yield call(userApi.flightQuoteSearch, action.payload);
    yield put(fetchQuoteReturn(user));
  } catch (error) {
    yield put(fetchQuoteReturn({}));
  }
}
function* ruleRequestAction(action) {
  try {
    const user = yield call(userApi.flightRuleSearch, action.payload);
    yield put(fetchRuleReturn(user));
  } catch (error) {
    yield put(fetchRuleReturn({}));
  }
}

export function* flightFareWatcher() {
  yield takeLatest(RULE_REQUEST, ruleRequest);
  yield takeLatest(QUOTE_REQUEST, quoteRequest);
  yield takeLatest(RULE_REQUEST_RETURN, ruleRequestAction);
  yield takeLatest(QUOTE_REQUEST_RETURN, quoteRequestReturn);
}
