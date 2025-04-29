import { takeEvery, takeLatest, call, put, all } from "redux-saga/effects";
import axios from "axios";
import userApi from "../API/api";
import {
  fetchReturn,
  amadeusSearchSuccess,
  amadeusSearchFailure,
  tbo_kafila_SearchSuccess,
  tbo_kafila_SearchFailure,
} from "../FlightSearch/Return/return";
import {
  RETURN_REQUEST,
  AMADEUS_SEARCH_RETURN_REQUEST,
  TBO_KAFILA_SEARCH_RETURN_REQUEST,
} from "../FlightSearch/Return/returnActionType";
import { apiURL } from "../../Constants/constant";

const fetchAmadeusData = (url, payload) => axios.post(url, payload);

function* amadeusSearchSaga(action) {
  const { onwardPayload, returnPayload } = action.payload;
  // console.log(returnPayload, "return payload in return saga");
  try {
    const [onwardResult, returnResult] = yield all([
      call(
        fetchAmadeusData,
        `${apiURL.baseURL}/skytrails/api/combined/AMADEUSPriceSort`,
        onwardPayload
      ),
      returnPayload
        ? call(
            fetchAmadeusData,
            `${apiURL.baseURL}/skytrails/api/combined/AMADEUSPriceSort`,
            returnPayload
          )
        : [],
    ]);

    if (onwardResult || returnResult) {
      const data = {
        journeyFlight: onwardResult?.data?.result,
        returnFlight: returnResult?.data?.result
          ? returnResult?.data?.result
          : [],
      };
      yield put(amadeusSearchSuccess(data));
    } else {
      throw new Error("One or both API requests failed");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    yield put(amadeusSearchFailure(error.message));
  }
}

function* tbo_kafila_SearchSaga(action) {
  const { onwardPayload, returnPayload } = action.payload;
  try {
    const [onwardResult, returnResult] = yield all([
      call(
        fetchAmadeusData,
        `${apiURL.baseURL}/skytrails/api/combine/combineApiRes`,
        onwardPayload
      ),
      returnPayload
        ? call(
            fetchAmadeusData,
            `${apiURL.baseURL}/skytrails/api/combine/combineApiRes`,
            returnPayload
          )
        : [],
    ]);
    // console.log(onwardResult, returnResult, "tvokafilaaaa");
    if (onwardResult || returnResult) {
      // console.log(onwardResult, returnResult, onwardResult.data.result, "tvokafilaaaa");
      const data = {
        journeyFlight: onwardResult?.data?.result,
        returnFlight: returnResult?.data?.result
          ? returnResult?.data?.result
          : [],
      };
      // console.log(data, "data in the line 82");
      yield put(tbo_kafila_SearchSuccess(data));
    } else {
      throw new Error("One or both API requests failed");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    yield put(tbo_kafila_SearchFailure(error.message));
  }
}

function* returnRequest(action) {
  try {
    const data = yield call(userApi.returnSearch, action.payload);
    yield put(fetchReturn(data));
  } catch (error) {
    console.log(error);
  }
}

export function* watchAmadeusReturnSearch() {
  yield takeEvery(AMADEUS_SEARCH_RETURN_REQUEST, amadeusSearchSaga);
}

export function* watchTobKailaReturnSearch() {
  yield takeEvery(TBO_KAFILA_SEARCH_RETURN_REQUEST, tbo_kafila_SearchSaga);
}

export function* returnWatcher() {
  yield takeEvery(RETURN_REQUEST, returnRequest);
}
