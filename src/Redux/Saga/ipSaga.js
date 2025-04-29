import { takeLatest, call, put } from "redux-saga/effects";
import userApi from "../API/api";
import { IP_REQUEST, TOKEN_REQUEST } from "../IP/actionType";
import { fetchIp, fetchToken } from "../IP/actionIp";

function* userIpRequest() {
  try {
    const ip = yield call(userApi.userIP);
    yield put(fetchIp(ip));
  } catch (error) {
    console.log(error);
  }
}

function* userTokenRequest(action) {
  try {
    const token = yield call(userApi.userB2BToken, action.payload);
    yield put(fetchToken(token));
  } catch (error) {
    console.log(error);
  }
}

export function* ipWatcher() {
  yield takeLatest(IP_REQUEST, userIpRequest);
  yield takeLatest(TOKEN_REQUEST, userTokenRequest);
}

