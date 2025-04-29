
import { takeLatest, call, put } from "redux-saga/effects";
import userApi from "../API/api";
import { fetchTNPLSuccess, setUserDataSuccess, submitOtpSuccess, tnplPlanGeneratorSuccess } from "../TNPL/tnpl";
import { FETCH_TNPL_REQUEST, USER_DATA_REQUEST, SUBMIT_OTP_REQUEST, TNPL_PLANGENERATOR_REQUEST } from "../TNPL/tnplActionType";

function* tnplRequest(action) {
    try {
        const data = yield call(userApi.fetchTNPL, action.payload);
        yield put(fetchTNPLSuccess(data));
    } catch (error) {
        console.log(error, "error h");
    }
}

function* tnplUserData(action) {
    try {
        const data = yield call(userApi.tnplUserData, action.payload);
        yield put(setUserDataSuccess(data));
    } catch (error) {
        console.log(error);
    }
}

function* tnplVerifiedOTP(action) {
    try {
        const data = yield call(userApi.tnplOTPVerified, action.payload);
        yield put(submitOtpSuccess(data));
    } catch (error) {
        console.log(error);
    }
}


function* tnplPlanGeneratorFunction(action) {
    try {
        const data = yield call(userApi.tnplPlanGenerator, action.payload);
        yield put(tnplPlanGeneratorSuccess(data));
    } catch (error) {
        console.log(error);
    }
}


export function* tnplWatcher() {
    yield takeLatest(FETCH_TNPL_REQUEST, tnplRequest);
    yield takeLatest(USER_DATA_REQUEST, tnplUserData);
    yield takeLatest(SUBMIT_OTP_REQUEST, tnplVerifiedOTP);
    yield takeLatest(TNPL_PLANGENERATOR_REQUEST, tnplPlanGeneratorFunction);

}
